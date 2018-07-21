/**
 * JWT Middleware
 */
import passport from 'passport';
import passportJwt from 'passport-jwt';
import { StrategyOptions } from 'passport-jwt';
const jwtStrategy = passportJwt.Strategy;
const extractJwt = passportJwt.ExtractJwt;
import { Request, Response, NextFunction } from 'express';
import log4js from '../util/log4js';
const logger = log4js.getLogger('JWT-MIDDLEWARE');
import jwtAuth from './jwt-auth';
import CWAError, { ErrorObj } from '../error/cwa-error';
import httpCodes from '../error/http-codes';

const jwtMiddleware = (secrets: any) => {
    const authMgr = new jwtAuth(secrets); // Creates a JWTAuth object

    const jwtStrategyOpts: StrategyOptions = {
        jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secrets.JWT_SECRET
    };

    passport.use(new jwtStrategy(jwtStrategyOpts, authMgr.verify.bind(authMgr)));

    return (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('jwt', {session: false}, (err, user) => {
            if (err) {
                logger.error(err);
                return next(err);
            }
            if (!user) {
                const errObj: ErrorObj = {
                    message: 'UNAUTHORIZED',
                    code: 1000,
                    status: httpCodes.UNAUTHORIZED
                };
                const error = new CWAError(errObj);
                logger.error(error.message);
                return next(error);
            }
            req.user = user || {};
            logger.trace('User authenticated: %s', req.user);
            return next();
        })(req, res, next);
    };
};

export default jwtMiddleware;
