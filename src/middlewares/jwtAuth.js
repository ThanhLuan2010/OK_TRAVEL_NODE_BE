const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const logger = require('../config/logger');
const { userService } = require('../services');
const { responseMessage } = require('../utils/responseFormat');

const authJwt = (roles) => async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json(responseMessage('No token Bearer', httpStatus.UNAUTHORIZED));
    }

    if (token.startsWith('Bearer ')) {
      token = token.substring(7);
    } else {
      return res.status(httpStatus.UNAUTHORIZED).json(responseMessage('Invalid token', httpStatus.UNAUTHORIZED));
    }

    const payload = jwt.verify(token, Buffer.from(config.jwt.secret, 'base64'), { algorithms: ['HS384'] });
    const user = await userService.getUserByEmail(payload.email);
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json(responseMessage(`Don't find user in system`, httpStatus.BAD_REQUEST));
    }

    if (!user.enabled) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(responseMessage(`Your account is not active!.`, httpStatus.BAD_REQUEST));
    }

    if (user.locked) {
      return res.status(httpStatus.BAD_REQUEST).json(responseMessage(`Your account is locked!.`, httpStatus.BAD_REQUEST));
    }

    user.role = payload.authorities[0];

    if (roles) {
      if (!roles.includes(user.role)) {
        return res.status(httpStatus.FORBIDDEN).json(responseMessage(`Your not have permission.`, httpStatus.FORBIDDEN));
      }
    }

    delete user.password;

    req.user = user;
    next();
  } catch (e) {
    return res.status(httpStatus.UNAUTHORIZED).json(responseMessage(e.message, httpStatus.UNAUTHORIZED));
  }
};

module.exports.generateJWT = async (userId) => {
  const expireTime = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const payload = {
    userId,
    iat: moment().unix(),
    exp: expireTime.unix(),
  };
  try {
    return jwt.sign(payload, config.jwt.secret);
  } catch (error) {
    logger.error(error.message);
  }
};

const authJwtSocket = (header) => {
  try {
    if (!header) {
      return { status: false, message: 'Invalid Header' };
    }

    const parts = header.split(' ');
    if (parts.length !== 2 && parts[0] !== 'Bearer') {
      return { status: false, message: 'No Bearer' };
    }

    const token = parts[1];
    const decoded = jwt.verify(token, Buffer.from(config.jwt.secret, 'base64'), { algorithms: ['HS384'] });
    const email = decoded.email;
    return { status: true, message: 'success', email };
  } catch (e) {
    logger.error(`ERR: authJWTSocket ${e.message}`);
    return { status: false, message: e.message };
  }
};

module.exports = {
  authJwt,
  authJwtSocket,
};
