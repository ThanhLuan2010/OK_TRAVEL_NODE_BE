const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().required().description('DB_HOST'),
    DB_USER: Joi.string().required().description('DB_USER'),
    DB_PASSWORD: Joi.string().required().description('DB_PASSWORD'),
    DB_NAME: Joi.string().required().description('DB_NAME'),
    DB_PORT: Joi.number().required().description('DB_PORT'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_SECRET_ADMIN: Joi.string().required().description('JWT secret key for admin'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    REDIS_HOST: Joi.string().allow('').description('redis'),
    REDIS_PORT: Joi.number().allow('').description('redis'),
    REDIS_PASS: Joi.string().allow('').description('redis'),
    S3_ACCESS_KEY: Joi.string().description('Access key s3'),
    S3_SECRET_KEY: Joi.string().description('Access secret key s3'),
    S3_URI: Joi.string().description('S3 uri'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mysql: {
    DB_NAME: envVars.DB_NAME,
    DB_USER: envVars.DB_USER,
    DB_PASSWORD: envVars.DB_PASSWORD,
    DB_HOST: envVars.DB_HOST,
    DB_PORT: envVars.DB_PORT,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    secretAdmin: envVars.JWT_SECRET_ADMIN,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    password: envVars.REDIS_PASS,
  },
  s3: {
    accessKey: envVars.S3_ACCESS_KEY,
    secretKey: envVars.S3_SECRET_KEY,
    uri: envVars.S3_URI,
  },
};
