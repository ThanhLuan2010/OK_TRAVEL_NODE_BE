const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.mysql.DB_NAME, config.mysql.DB_USER, config.mysql.DB_PASSWORD, {
  host: config.mysql.DB_HOST,
  port: config.mysql.DB_PORT,
  dialect: 'mysql',
});

module.exports = sequelize;
