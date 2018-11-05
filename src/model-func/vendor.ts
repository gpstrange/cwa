import Vendor, { VendorInterface } from '../models/vendor';
import log4js from '../util/log4js';
const logger = log4js.getLogger('USER-MODEL-FUNC');
const ObjectID = require('mongodb').ObjectID;

export const getVendorsDb = (query: any, cb: any) => {
    Vendor.find(query, (err, data: VendorInterface[]) => {
        if (err) {
            logger.error(err);
            return cb(err);
        }
        return cb(undefined, data);
    });
};

export const updateVendorDb = (id: any, vendorObj: VendorInterface, cb: any) => {
    Vendor.findOneAndUpdate({ _id: ObjectID(id) }, vendorObj, (err, data) => {
        if (err) {
            logger.error(err);
            return cb(err);
        }
        return cb(undefined, data);
    });
};
