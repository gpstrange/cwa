/**
 * Vendor Controller
 */
import { Request, Response, NextFunction } from 'express';
import jwtAuth from '../auth/jwt-auth';
import config from '../config';
import CWAError, { ErrorObj } from '../error/cwa-error';
import httpCodes from '../error/http-codes';
import log4js from '../util/log4js';
import bcrypt from 'bcrypt';
import { getVendorsDb } from '../model-func/vendor';
import Vendor, { VendorInterface } from '../models/vendor';
import { counter } from '../model-func/system';
const logger = log4js.getLogger('VENDOR-CTRL');

export const addVendor = (req: Request, res: Response, next: NextFunction) => {
    logger.debug('FUNC - Add vendor by user =', req.body.mobileNumber);
    if (!req.body) {
        logger.debug('FUNC - addVendor, Err- MISSING DATAS by user =', req.body.mobileNumber);
        const errObj: ErrorObj = {
            message: 'MISSING DATAS - Please fill all required details',
            code: 1002,
            status: httpCodes.UNAUTHORIZED
        };
        const error = new CWAError(errObj);
        return next(error);
    }
    if (!req.body.mobileNumber1 || !req.body.email || !req.body.password || !req.body.name) {
            const errObj: ErrorObj = {
                message: 'MISSING Credentials',
                code: 1006,
                status: httpCodes.FORBIDDEN
            };
            const error = new CWAError(errObj);
            logger.error(error.message);
            return next(error);
    }
    if (!isNaN(req.body.mobileNumber1)) {
        req.body.mobileNumber1 = parseInt(req.body.mobileNumber1);
    } else {
        const errObj: ErrorObj = {
            message: 'INVALID- Mobile Number 1',
            code: 1001,
            status: httpCodes.FORBIDDEN
        };
        const error = new CWAError(errObj);
        logger.error(error.message);
        return next(error);
    }
    if (req.body.mobileNumber2 && !isNaN(req.body.mobileNumber2)) {
        req.body.mobileNumber2 = parseInt(req.body.mobileNumber2);
    } else {
        const errObj: ErrorObj = {
            message: 'INVALID- MobileNumber 2',
            code: 1001,
            status: httpCodes.FORBIDDEN
        };
        const error = new CWAError(errObj);
        logger.error(error.message);
        return next(error);
    }
    req.body.logoutNum = 0;
    const newVendor = <VendorInterface>(req.body);
    bcrypt.hash(newVendor.password, 10).then((pwdString) => {
        newVendor.password = pwdString;
        const vendor = new Vendor(newVendor);
        counter(newVendor.city, () => {

        });
        vendor.save((err, createdUser) => {
            if (err) {
                return next(err);
            }
            return res.json(createdUser);
        });
    });
};

export const getVendors = (req: Request, res: Response, next: NextFunction) => {
    const filter = <any>{};
    if (req.body.filter && req.body.value) {
        filter.query = { [req.body.filter]: req.body.value };
    }
    getVendorsDb(filter, (err: Error, data: VendorInterface[]) => {
        if (err) {
            return next(err);
        }
        return res.json(data);
    });
};
