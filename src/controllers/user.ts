/**
 * User Controller
 */
import { Request, Response, NextFunction } from 'express';
import jwtAuth from '../auth/jwt-auth';
import config from '../config';
import CWAError, { ErrorObj } from '../error/cwa-error';
import httpCodes from '../error/http-codes';
import log4js from '../util/log4js';
const logger = log4js.getLogger('USER-CTRL');
import bcrypt from 'bcrypt';
import * as User from '../model-func/user';
import { UserModel } from '../models/user';

const secrets = {
    JWT_SECRET: config.JWT_SECRET,
    JWT_PL_SECRET: config.JWT_PL_SECRET,
    JWT_SALT: config.JWT_SALT
};

export let getUsers = (req: Request, res: Response, next: NextFunction) => {
    logger.debug('FUNC - Get Users by user =', req.user.mobileNumber);
    // User.find({}, (err, data) => {
    //     if (err) {
    //         logger.error(err);
    //         return next(err);
    //     }
    //     return res.json(data);
    // });
};

export let login = (req: Request, res: Response, next: NextFunction) => {
    logger.debug('FUNC - Get Users by user =', req.body.mobileNumber);
    const query = {
        mobileNumber: req.body.mobileNumber,
    };
    User.getUserDb(query, (err: any, data: any) => {
        if (err) {
            logger.error(err + ', user =', req.body.mobileNumber);
            return next(err);
        }
        // Brcypt compare password
        bcrypt.compare(req.body.password, data.password, (err: Error, success: any) => {
            if (!success) {
                logger.error('Incorrect Password, user =', data.mobileNumber);
                const errObj: ErrorObj = {
                    message: 'Incorrect Password',
                    code: 1003,
                    status: httpCodes.UNAUTHORIZED
                };
                const error = new CWAError(errObj);
                return next(error);
            }
            logger.debug('Success- bcrypt compare password, User =', data.mobileNumber);
            const authMgr = new jwtAuth(secrets);
            const accessToken = authMgr.generateToken(data, false);
            const refreshToken = authMgr.generateToken(data, true);
            return res.json({ accessToken, refreshToken, user: data });
        });
    });
};

export let refreshToken = (req: Request, res: Response, next: NextFunction) => {
    logger.debug('FUNC - refreshToken by user =', req.body.mobileNumber);
    const authMgr = new jwtAuth(secrets);
    if (!req.user.isRefresh) {
        const errObj: ErrorObj = {
            message: 'UNAUTHORIZED',
            code: 1002,
            status: httpCodes.UNAUTHORIZED
        };
        const error = new CWAError(errObj);
        return next(error);
    }
    const token = authMgr.generateToken(req.user, false);
    return res.json({token});
};
