const httpStatus = require('http-status');
const { responseMessage } = require('./responseFormat');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(err);
    }
    const httpCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    return res.status(httpCode).json(responseMessage(err.message, httpCode));
  });
};

module.exports = catchAsync;
