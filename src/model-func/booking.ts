import Booking from '../models/booking';
import log4js from '../util/log4js';
const logger = log4js.getLogger('BOOKING-MODEL-FUNC');

export const newBooking = (data: any, cb: any) => {
    const newBooking = new Booking(data);
    newBooking.save((err, booking) => {
        if (err) {
            logger.error(err);
            return cb(err);
        }
        logger.debug('Success- Created new booking id =', booking._id);
        return cb(undefined, booking);
    });
};
