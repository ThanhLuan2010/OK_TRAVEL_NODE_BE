const Joi = require('joi');
const { MESSAGE_TYPE } = require('../constant/conversation.constant');

const newConversation = Joi.object().keys({
  email: Joi.string().email().required(),
});

const newMessage = Joi.object().keys({
  conversation_id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  message: Joi.string().required(),
  message_type: Joi.string().valid(...Object.values(MESSAGE_TYPE)),
});

module.exports = {
  newConversation,
  newMessage,
};
