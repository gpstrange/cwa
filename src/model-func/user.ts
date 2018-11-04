/**
 * User Model-Func
 */
import User from '../models/user';
import log4js from '../util/log4js';
const logger = log4js.getLogger('USER-MODEL-FUNC');
import { UserModel } from '../models/user';

export const getUserDb = (query: any, cb: any) => {
    User.findOne(query, (err, data: UserModel) => {
        if (err) {
            logger.error(err);
            return cb(err);
        }
        if (!data) {
            return cb('User not found');
        }
        return cb(undefined, data);
    });
};

export const getUsersDb = (query: any, cb: any) => {
    User.find(query, (err, data: UserModel[]) => {
        if (err) {
            logger.error(err);
            return cb(err);
        }
        return cb(undefined, data);
    });
};

// export const addUser = ()