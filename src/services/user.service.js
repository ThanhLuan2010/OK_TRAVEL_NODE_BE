const logger = require('../config/logger');
const sequelize = require('../config/database');

const getUserByUserId = async (userId) => {
  // return UserModel.findOne({ userId });
};

const getUserByUsername = async (username) => {
  // return UserModel.findOne({ username });
};

const getUserByEmail = async (email) => {
  try {
    const [result] = await sequelize.query('SELECT * FROM account_entity WHERE email = :email', {
      replacements: { email },
      type: sequelize.QueryTypes.SELECT,
    });
    result.is_delete = Buffer.isBuffer(result.is_delete) ? Boolean(result.is_delete.readUInt8(0)) : null;
    result.enabled = Buffer.isBuffer(result.enabled) ? Boolean(result.enabled.readUInt8(0)) : null;
    result.is_deleted = Buffer.isBuffer(result.is_deleted) ? Boolean(result.is_deleted.readUInt8(0)) : null;
    result.locked = Buffer.isBuffer(result.locked) ? Boolean(result.locked.readUInt8(0)) : null;
    return result;
  } catch (error) {
    logger.error(`Error getUserByEmail:, ${error.message}`);
  }
};

module.exports = {
  getUserByUserId,
  getUserByUsername,
  getUserByEmail,
};
