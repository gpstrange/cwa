/**
 * Log4js Configuration
 */
import config from './index';
import path from 'path';

const log4jsConf = {
    // For Production
    file: {
        appenders: {
            // HTTP logs
            access: {
                type: 'dateFile',
                filename: path.join(config.SERVER_LOG_DIR, '/access.log'),
                pattern: '-yyyy-MM-dd',
                category: 'http'
            },
            // App logs
            app: {
                type: 'file',
                filename: path.join(config.SERVER_LOG_DIR, '/app.log'),
                maxLogSize: 10485760,
                numBackups: 3
            },
            // Error logs
            errorFile: {
                type: 'file',
                filename: path.join(config.SERVER_LOG_DIR, '/errors.log')
            },
            errors: {
                type: 'logLevelFilter',
                level: 'ERROR',
                appender: 'errorFile'
            }
        },
        categories: {
            default: {
                appenders: [
                    'app',
                    'errors'
                ],
                level: 'DEBUG'
            },
            http: {
                appenders: [
                    'access'
                ],
                level: 'DEBUG'
            }
        }
    },
    // For Development
    console: {
        appenders: {
            app: {
                type: 'console',
            }
        },
        categories: {
            default: {
                appenders: [
                    'app'
                ],
                level: 'DEBUG'
            }
        }
    }
};

export default log4jsConf;
