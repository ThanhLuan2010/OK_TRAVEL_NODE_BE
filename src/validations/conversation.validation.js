const Joi = require('joi');

const list = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(20),
  }),
};

const listMessages = {
  query: Joi.object().keys({
    conversation_id: Joi.string().uuid({ version: 'uuidv4' }).required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(50),
  }),
};

const newConversation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

module.exports = {
  list,
  newConversation,
  listMessages,
};
