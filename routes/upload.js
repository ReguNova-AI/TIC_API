const express = require('express');
const router = new express.Router();
const { setResponse } = require('../utils/response');

const {
  SUCCESS,
  BAD_REQUEST,
  STATUS_CODE_SUCCESS,
  STATUS_CODE_BAD_REQUEST,
  CUSTOM_RESPONSE,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
} = require('../constants/response_constants');
const { logger } = require('../utils/logger');
const {
  uploadFileToS3,
  getFileFromS3,
  deleteFileFromS3,
} = require('../service/upload_service');

router.post('/api/v1/uploadToS3', async (req, res) => {
  try {
    const {
      body: { documents = [], type = '' },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (documents && documents.length > 0 && type.length > 0) {
      let response = await uploadFileToS3(documents, type);
      if (response) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.details = response;
        data.message = 'Uploaded Successfully';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Failed to upload';
        customResponse.messageCode = statusCode;
      }
    } else {
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = 'Document not found, Please upload a document';
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('upload file to S3 route', err);
    res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
  }
});

router.post('/api/v1/getFromS3', async (req, res) => {
  try {
    const {
      body: { imageKeys = [] },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (imageKeys && imageKeys.length > 0) {
      let res = await getFileFromS3(imageKeys);
      if (res) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data = res;
        data.message = 'Fetched Details Successfully';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Failed to get response';
        customResponse.messageCode = statusCode;
      }
    } else {
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = 'Image key not found, please select an image';
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('get file from s3 route', err);
    res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
  }
});

router.post('/api/v1/deleteFromS3', async (req, res) => {
  try {
    const {
      body: { imageKey = '' },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (imageKey) {
      await deleteFileFromS3(imageKey);
      responseType = SUCCESS;
      statusCode = STATUS_CODE_SUCCESS;
      data.message = 'Deleted Successfully';
    } else {
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = 'Image key not found, please select an image';
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('delete file from s3 route', err);
    res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
  }
});

module.exports = router;
