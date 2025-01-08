const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { roleRights } = require('../constant/roles.constant');
const { getManagerByEmail } = require('../services/manager.service');

const authJwtAdmin =
  (...requiredRights) =>
  async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: false,
        message: 'No token Bearer',
      });
    }
    if (!token.startsWith('Bearer')) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: false,
        message: 'Token start with Bearer',
      });
    }
    token = token.split(' ')[1];

    try {
      const { email } = jwt.verify(token, config.jwt.secretAdmin);
      const manager = await getManagerByEmail(email);
      if (!manager) {
        return res.status(httpStatus.OK).json({
          status: false,
          message: `Don't find manager in system`,
        });
      }

      if (manager.isBlock) {
        return res.status(200).json({
          status: false,
          message: `Your account is temporarily locked due to detecting misconduct. Please contact support@herobook.io for more details!.`,
        });
      }

      if (requiredRights.length) {
        const managerRights = roleRights.get(manager.role);
        const hasRequiredRights = requiredRights.every((requiredRight) => managerRights.includes(requiredRight));
        if (!hasRequiredRights) {
          return res.status(httpStatus.FORBIDDEN).json({
            status: false,
            message: `You don't have permission to access this resource`,
          });
        }
      }

      req.user = manager;
      next();
    } catch (err) {
      console.log(err);
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: false,
        message: err.message,
      });
    }
  };

module.exports = {
  authJwtAdmin,
};
