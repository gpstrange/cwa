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
import UserSchema, { UserModel } from '../models/user';
import { counter } from '../model-func/system';
import { CounterSchema } from '../models/counter';
import * as Booking from '../model-func/booking';
import Car from '../models/car';

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

// export let refreshToken = (req: Request, res: Response, next: NextFunction) => {
//     logger.debug('FUNC - refreshToken by user =', req.body.mobileNumber);
//     const authMgr = new jwtAuth(secrets);
//     if (!req.user.isRefresh) {
//         const errObj: ErrorObj = {
//             message: 'UNAUTHORIZED',
//             code: 1002,
//             status: httpCodes.UNAUTHORIZED
//         };
//         const error = new CWAError(errObj);
//         return next(error);
//     }
//     const token = authMgr.generateToken(req.user, false);
//     return res.json({token});
// };

export const signUp = (req: Request, res: Response, next: NextFunction) => {
    logger.debug('FUNC - signup by user =', req.body.mobileNumber);
    if (!req.body) {
        logger.debug('FUNC - signUp, Err- MISSING DATAS by user =', req.body.mobileNumber);
        const errObj: ErrorObj = {
            message: 'MISSING DATAS - Please fill all required details',
            code: 1002,
            status: httpCodes.UNAUTHORIZED
        };
        const error = new CWAError(errObj);
        return next(error);
    }
    if (!req.body.mobileNumber || !req.body.email || !req.body.password || !req.body.name) {
            const errObj: ErrorObj = {
                message: 'MISSING Credentials',
                code: 1006,
                status: httpCodes.FORBIDDEN
            };
            const error = new CWAError(errObj);
            logger.error(error.message);
            return next(error);
    }
    if (!isNaN(req.body.mobileNumber)) {
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
    req.body.logoutNum = 0;
    const newUser = <UserModel>(req.body);
    bcrypt.hash(newUser.password, 10).then((pwdString) => {
        newUser.password = pwdString;
        const user = new UserSchema(newUser);
        user.save((err, createdUser) => {
            if (err) {
                return next(err);
            }
            return res.json(createdUser);
        });
    });
};


export const bookService = (req: Request, res: Response, next: NextFunction) => {
    logger.debug('FUNC - book-service by user =', req.body.mobileNumber);
    if (!req.body || !req.body.vendorId || !req.body.carId || !req.body.serviceType || !req.body.serviceId || !req.body.amount) {
        logger.debug('FUNC - book-service, Err- MISSING DATAS by user =', req.body.mobileNumber);
        const errObj: ErrorObj = {
            message: 'MISSING DATAS - Please fill all required details',
            code: 1002,
            status: httpCodes.UNAUTHORIZED
        };
        const error = new CWAError(errObj);
        return next(error);
    }
    req.body.userId = req.user._id;
    req.body.createdDate = new Date();
    Booking.newBooking(req.body, (err: Error, data: any) => {
        if (err) {
            return next(err);
        }
        return res.json(data);
    });
};

export const addCar =  (req: Request, res: Response, next: NextFunction) => {
    logger.debug('FUNC - add-car by user =', req.body.mobileNumber);
    if (!req.body || !req.body.modelName || !req.body.registrationNumber ) {
        logger.debug('FUNC - add-car, Err- MISSING DATAS by user =', req.body.mobileNumber);
        const errObj: ErrorObj = {
            message: 'MISSING DATAS - Please fill all required details',
            code: 1002,
            status: httpCodes.UNAUTHORIZED
        };
        const error = new CWAError(errObj);
        return next(error);
    }
    const carObj = {
        userId: req.user._id,
        modelName: req.body.modelName,
        registrationNumber: req.body.registrationNumber
    };
    const newCar = new Car(carObj);
    newCar.save((err, data) => {
        if (err) {
            return next(err);
        }
        return res.json({status: 'ok', message: 'Car added successfully'});
    });
};
