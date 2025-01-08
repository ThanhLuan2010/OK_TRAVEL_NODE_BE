const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { interestedService } = require('../services');
const { responseData, responseMessage } = require('../utils/responseFormat');

const list = catchAsync(async (req, res) => {
  const data = await interestedService.list(req.user.id);
  res.status(httpStatus.OK).json(responseData(data, 'Successfully'));
});

const action = catchAsync(async (req, res) => {
  const data = await interestedService.action(req.user.id, req.body);
  if (data === 1) {
    return res.status(httpStatus.OK).json(responseMessage('Interested Successfully'));
  }
  if (data === 2) {
    return res.status(httpStatus.OK).json(responseMessage('Un Interested Successfully'));
  }
  if (data === 3) {
    return res.status(httpStatus.BAD_REQUEST).json(responseMessage('Invalid Service', httpStatus.BAD_REQUEST));
  }
  return res
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .json(responseMessage('INTERNAL_SERVER_ERROR', httpStatus.INTERNAL_SERVER_ERROR));
});

module.exports = {
  list,
  action,
};
