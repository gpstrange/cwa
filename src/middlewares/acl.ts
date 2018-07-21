/**
 * Verify ACL Middleware
 */
import { Request, Response, NextFunction } from 'express';
import CWAError, { ErrorObj } from '../error/cwa-error';
import httpCodes from '../error/http-codes';

export const verifyAcl = (routeLvl: number) => {
    return function (req: Request, res: Response, next: NextFunction) {
        if (req.user.securityLevel <= routeLvl) { // Checks userSecurityLvl with routeSecurityLvl
            return next();
        }
        const errObj: ErrorObj = {
            message: 'UNAUTHORIZED',
            code: 1000,
            status: httpCodes.UNAUTHORIZED
        };
        const error = new CWAError(errObj);
        return next(error);
    };
};