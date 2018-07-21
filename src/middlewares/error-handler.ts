/**
 * Error Handler -Express
 */
import { Request, Response, NextFunction } from 'express';
import CWAError, { ErrorObj } from '../error/cwa-error';

const errorHandler = (err: ErrorObj, req: Request, res: Response, next: NextFunction) => {
    if (!err) {
        return next();
    }
    if (err instanceof CWAError) {
        // App level error
        res.status(err.statusCode).send({
            message: err.message,
            errCode: err.errCode
        });
    }
    return next(err);
};

export default errorHandler;
