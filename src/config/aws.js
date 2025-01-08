const { S3 } = require('aws-sdk');
const config = require('./config');

const s3Client = new S3({
  accessKeyId: config.s3.accessKey,
  secretAccessKey: config.s3.secretKey,
});

module.exports = s3Client;
