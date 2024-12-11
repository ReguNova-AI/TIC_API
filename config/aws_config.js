const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const s3 = new AWS.S3();
AWS.config.update({ region: process.env.region });
const { logger } = require('../utils/logger');

const uploadToS3 = async (params) => {
  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getFromS3 = async (params) => {
  return new Promise((resolve, reject) => {
    s3.getObject(params, function (err, res) {
      if (err) {
        logger.error(err);
        resolve(err);
      } else {
        var buffer = Buffer.from(res.Body);
        var string64 = buffer.toString('base64');
        resolve(string64);
      }
    });
  });
};

const smtpTransporter = nodemailer.createTransport({
  port: process.env.SMTP_PORT,
  host: process.env.SMTP_HOST,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  debug: true,
});

module.exports = { uploadToS3, getFromS3, smtpTransporter };
