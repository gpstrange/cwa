import Counter, { CounterSchema } from '../models/counter';
import log4js from '../util/log4js';
const logger = log4js.getLogger('COUNTER-MODEL-FUNC');

export const counter = (city: string, cb: any) => {
    let cityName: string;
    cityName = getCityName(city);
    Counter.findOne({ cityName }, (err, data: CounterSchema) => {
        if (err) {
            logger.error(err);
            return cb(err);
        }
        if (!data) {
            data = new Counter({
                cityName,
                value: 0
            });
        }
        data.value = data.value + 1;
        data.save((err, count) => {
            if (err) {
                logger.error(err);
                return cb(err);
            }
            logger.debug('Success- Create Vendor of city', city, 'count = ', count.value);
            return cb(undefined, count);
        });
    });
};

const getCityName = (city: string) => {
    if (city === 'CHENNAI') {
        return 'CHE';
    }
    if (city === 'HYDERABAD') {
        return 'HYD';
    }
};
