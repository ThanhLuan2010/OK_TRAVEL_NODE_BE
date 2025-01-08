const { Server } = require('socket.io');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;
// require('./redis');

const { SocketServer } = require('./socket');
const sequelize = require('./config/database');

(async () => {
  try {
    await sequelize.authenticate();
    logger.info(`Connected to MySQL ${config.mysql.DB_HOST}`);
    server = app.listen(config.port, () => {
      logger.info(`Server start: http://localhost:${config.port}`);
    });

    const io = new Server(server, {
      cors: { origin: '*' },
    }).of('/socket');
    logger.info(`Socket start: ws://localhost:${config.port}/socket`);

    global._io = io;

    SocketServer(io);
  } catch (e) {
    logger.error(`ERR init server: ${e.message}`);
  }
})();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
