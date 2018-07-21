import log4js from 'log4js';
import log4jsConf from '../config/log4js';
import config from '../config/index';
import fs from 'fs';

if (process.env.NODE_ENV === 'production') {
    try {
        fs.mkdirSync(config.SERVER_LOG_DIR);
    } catch (e) {
        console.log(e);
        process.exit(-1);
    }
    log4js.configure(log4jsConf.file);
} else {
    log4js.configure(log4jsConf.console);
}
export default log4js;
