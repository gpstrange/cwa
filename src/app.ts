import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import helmet from 'helmet';
import bluebird from 'bluebird';
import config from './config';
import log4js from './util/log4js';
const logger = log4js.getLogger('APP');
import routes from './routes';
import errorHandler from './middlewares/error-handler';

const app = express();

app.set('port', config.PORT);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(log4js.connectLogger(log4js.getLogger('http'), {level: 'auto'}));

process.on('uncaughtException', function(err) {
  logger.error(err.message);
  logger.error(err.stack);
  process.exit(1);
});

(<any>mongoose).Promise = bluebird;
mongoose.connect(config.MONGO_URL).then(
  () => {
      logger.info('Connected to mongo');
   }
).catch(err => {
  logger.error('MongoDB connection error. Please make sure MongoDB is running. ');
  process.exit();
});

routes(app);

app.use(errorHandler);

export default app;
