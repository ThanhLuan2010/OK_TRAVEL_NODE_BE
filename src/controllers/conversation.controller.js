const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { conversationService } = require('../services');
const { responseData, responseMessage } = require('../utils/responseFormat');
const { CONVERSATION_EVENT } = require('../constant/socket.constant');

const list = catchAsync(async (req, res) => {
  const data = await conversationService.findListConversation(req.user.id, req.query.page, req.query.limit);
  data.data.map((conversation) => {
    conversation.is_delete = Buffer.isBuffer(conversation.is_delete) ? Boolean(conversation.is_delete.readUInt8(0)) : null;
    return conversation;
  });
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

const listMessages = catchAsync(async (req, res) => {
  const data = await conversationService.findListMessage(req.user.id, req.query);
  data.data.map((message) => {
    message.is_delete = Buffer.isBuffer(message.is_delete) ? Boolean(message.is_delete.readUInt8(0)) : null;
    return message;
  });
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

const newConversation = catchAsync(async (req, res) => {
  if (req.user.email === req.body.email) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('Invalid', httpStatus.BAD_REQUEST));
  }
  const data = await conversationService.findOneOrCreateNewConversationPersonal(req.user.email, req.body.email);
  if (!data) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('BAD_REQUEST', httpStatus.BAD_REQUEST));
  }

  data.is_delete = Buffer.isBuffer(data.is_delete) ? Boolean(data.is_delete.readUInt8(0)) : null;
  _io.to(req.user.email).emit(CONVERSATION_EVENT.CONVERSATION_INF, data);
  _io.to(req.body.email).emit(CONVERSATION_EVENT.CONVERSATION_INF, data);
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

module.exports = {
  list,
  newConversation,
  listMessages,
};
