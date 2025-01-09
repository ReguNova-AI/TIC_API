const { logger } = require('../utils/logger');
const { uploadToS3, getFromS3 } = require('../config/aws_config');

const uploadFileToS3 = async (documents) => {
  try {
    let data = [];
    for (const item of documents) {
      const fileContent = item;
      const fileName = `File_` + Math.random().toString(36).substring(6);
      const s3Params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
      };
      let res = await uploadToS3(s3Params);
      data.push(res.Location);
    }
    return data;
  } catch (error) {
    logger.error('upload file to s3  service', error);
  }
};

const getFileFromS3 = async (params) => {
  try {
    const data = [];
    for (const key of params) {
      const getParams = {
        Key: key,
        Bucket: process.env.BUCKET_NAME,
      };
      const response = await getFromS3(getParams);
      let obj = { key, response };
      data.push(obj);
    }
    return data;
  } catch (error) {
    logger.error('get file from s3 service', error);
  }
};

module.exports = {
  uploadFileToS3,
  getFileFromS3,
};
