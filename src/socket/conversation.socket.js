const { CONVERSATION_EVENT, SOCKET_EVENT } = require('../constant/socket.constant');
const { socketValidate } = require('./socketValidate');
const { newMessage } = require('./socket.validation');
const logger = require('../config/logger');
const { conversationService } = require('../services');
const nodeCacheService = require('../services/nodeCache.service');
const { MESSAGE_TYPE } = require('../constant/conversation.constant');

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
      const checkError = socketValidate(newMessage, data);
      if (checkError) {
        return socket.emit(SOCKET_EVENT.ERROR, checkError?.message);
      }

      // check user in conversation
      let user = null;
      let receiver = null;
      const conversation = await nodeCacheService.getConversation(data.conversation_id);
      if (!conversation) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Conversation');
      } else {
        for (let i = 0; i < conversation.members.length; i++) {
          if (conversation.members[i].email === socket.email) {
            user = conversation.members[i];
          } else {
            receiver = conversation.members[i];
          }
        }
        if (!user) {
          return socket.emit(SOCKET_EVENT.ERROR, 'Invalid User Conversation');
        }
      }

      const newMessageRes = await conversationService.newMessage(user, data);
      if (newMessageRes) {
        data.account = user;
        io.to(`USER_${receiver.email}`).emit(CONVERSATION_EVENT.RECEIVE_MESSAGE, data);
        socket.emit(CONVERSATION_EVENT.RECEIVE_MESSAGE, data);
      }
    } catch (e) {
      logger.error(`ERR sendMessageSocket: ${e.message}`);
    }
  });
};

module.exports = conversationSocket;
