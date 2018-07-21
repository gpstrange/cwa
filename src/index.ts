
import app from './app';
import log4js from './util/log4js';
const logger = log4js.getLogger('APP-INDEX');
import mongoose from 'mongoose';

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  logger.debug(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  logger.debug('  Press CTRL-C to stop\n');
});

server.on('close', () => {
  mongoose.connection.close();
});

process.on('SIGINT', function() {
  server.close();
});

export default server;
