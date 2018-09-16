import { Express } from 'express';
import log4js from '../util/log4js';
const logger = log4js.getLogger('ROUTES');
import config from '../config';

const secrets = {
    JWT_SECRET: config.JWT_SECRET,
    JWT_PL_SECRET: config.JWT_PL_SECRET,
    JWT_SALT: config.JWT_SALT
};
import jwtAuthMiddleware from '../auth/jwt-middleware';
const jwtMiddleware = jwtAuthMiddleware(secrets);

import userRoutes from '../routes/user';

const routes = (app: Express) => {
    const authRouteFilter = new RegExp('' +
        /^(?!^\/api\/v\d+\/login(\/)?$)/.source +
        /^(?!^\/api\/v\d+\/reset-password(\/)?$)/.source
    );

    app.use(authRouteFilter, jwtMiddleware);
    app.use(`/api/${config.VERSION}/client`, userRoutes);
    app.use(`/api/${config.VERSION}/vendor`, userRoutes);
    logger.debug('App routes setup.');
};

export default routes;
