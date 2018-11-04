import Vendor, { VendorInterface } from '../models/vendor';
import log4js from '../util/log4js';
const logger = log4js.getLogger('USER-MODEL-FUNC');

export const getVendorsDb = (query: any, cb: any) => {
    Vendor.find(query, (err, data: VendorInterface[]) => {
        if (err) {
            logger.error(err);
            return cb(err);
        }
        return cb(undefined, data);
    });
};