/**
 * User Controller
 */
import User from '../models/user';
import { Request, Response, NextFunction } from 'express';
import jwtAuth from '../auth/jwt-auth';
import config from '../config';
import CWAError, { ErrorObj } from '../error/cwa-error';
import httpCodes from '../error/http-codes';
import log4js from '../util/log4js';
const logger = log4js.getLogger('USER-CTRL');
import { UserModel } from '../models/user';

const secrets = {
    JWT_SECRET: config.JWT_SECRET,
    JWT_PL_SECRET: config.JWT_PL_SECRET,
    JWT_SALT: config.JWT_SALT
};

export let getUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find({}, (err, data) => {
        if (err) {
            logger.error(err);
            return next(err);
        }
        return res.json(data);
    });
};

export let login = (req: Request, res: Response, next: NextFunction) => {
    User.findOne({
        mobileNumber: req.body.mobileNumber,
        password: req.body.password
    }, (err, data: UserModel) => {
        if (err) {
            logger.error(err);
            return next(err);
        }
        if (!data) {
            const errObj: ErrorObj = {
                message: 'User not found',
                code: 1002,
                status: httpCodes.UNAUTHORIZED
            };
            const error = new CWAError(errObj);
            return next(error);
        }
        const authMgr = new jwtAuth(secrets);
        const accessToken = authMgr.generateToken(data, false);
        const refreshToken = authMgr.generateToken(data, true);
        return res.json({ accessToken, refreshToken, user: data });
    });
};

export let refreshToken = (req: Request, res: Response, next: NextFunction) => {
    const authMgr = new jwtAuth(secrets);
    console.log(req.user);
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
