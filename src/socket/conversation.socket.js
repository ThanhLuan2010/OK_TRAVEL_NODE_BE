const { CONVERSATION_EVENT, SOCKET_EVENT } = require('../constant/socket.constant');
const { socketValidate } = require('./socketValidate');
const { newConversation, newMessage } = require('./socket.validation');
const logger = require('../config/logger');
const { conversationService } = require('../services');

const conversationSocket = (io, socket) => {
  /*socket.on(CONVERSATION_EVENT.NEW_CONVERSATION, async (data) => {
    try {
      const validate = socketValidate(newConversation, data);
      if (validate) {
        socket.emit(SOCKET_EVENT.ERROR, validate);
      }
      const conversation = await conversationService.findOneOrCreateNewConversationPersonal(socket.email, data.email);
      if (conversation) {
        socket.emit(CONVERSATION_EVENT.CONVERSATION_INF, conversation);
        io.to(data.email).emit(CONVERSATION_EVENT.CONVERSATION_INF, conversation);
      }
    } catch (e) {
      logger.error(`ERR newConversationSocket: ${e.message}`);
    }
  });*/

  socket.on(CONVERSATION_EVENT.SEND_MESSAGE, async (data) => {
    try {
      const validate = socketValidate(newMessage, data);
      if (validate) {
        socket.emit(SOCKET_EVENT.ERROR, validate);
      }
      const newMessage = await conversationService.newMessage(data);
      if (newMessage) {
        io.to(newMessage.conversation_id).emit(CONVERSATION_EVENT.RECEIVE_MESSAGE, newMessage);
      }
    } catch (e) {
      logger.error(`ERR newConversationSocket: ${e.message}`);
    }
  });
};

module.exports = conversationSocket;
