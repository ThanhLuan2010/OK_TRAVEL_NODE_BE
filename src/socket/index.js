const logger = require('../config/logger');
const { authJwtSocket } = require('../middlewares/jwtAuth');
const conversationSocket = require('./conversation.socket');

const SocketServer = (io) => {
  io.use((socket, next) => {
    try {
      const header = socket.handshake.headers.authorization;
      const auth = authJwtSocket(header);
      if (auth.status) {
        socket.email = auth.email;
        next();
      } else {
        return next(new Error('invalid'));
      }
    } catch (err) {
      logger.error(`ERR socket authenticate:, ${err.message}`);
    }
  });

  io.on('connection', async (socket) => {
    logger.info(`New user connected socket: ${socket.email}`);
    socket.join(`USER_${socket.email}`);

    conversationSocket(io, socket);

    socket.on('disconnect', async () => {
      logger.info(`Socket disconnect ${socket.email}`);
    });
  });
};

module.exports = {
  SocketServer,
};
