/**
 * Required Configurations
 */
const config: any = {
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/cwa',
    SERVER_LOG_DIR: process.env.SERVER_LOG_FILE || '../log',
    JWT_SECRET: process.env.JWT_SECRET || 'no s3cr3t',
    JWT_PL_SECRET:  process.env.JWT_PL_SECRET || 'my awe = some s3cret',
    JWT_SALT: process.env.JWT_SALT || 'p3pp3r'
};

export default config;
