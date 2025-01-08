const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const config = require('../config/config');
const { responseData, responseMessage } = require('../utils/responseFormat');
const logger = require('../config/logger');

const myInfo = catchAsync(async (req, res) => {
  const user = req.user;
  res.status(httpStatus.OK).json(responseData({ user }, 'Successfully'));
});

module.exports = {
  myInfo,
};
