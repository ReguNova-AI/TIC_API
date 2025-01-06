const express = require('express');
const router = new express.Router();
const { setResponse } = require('../utils/response');
const {
  SUCCESS,
  BAD_REQUEST,
  STATUS_CODE_SUCCESS,
  STATUS_CODE_BAD_REQUEST,
  CUSTOM_RESPONSE,
} = require('../constants/response_constants');
const { logger } = require('../utils/logger');
const {
  chatQuestionService,
  uploadCheckListService,
} = require('../service/chat_service');
const { validate } = require('../utils/helper');

const fileUpload = require('express-fileupload');
router.use(fileUpload());

router.post('/api/v1/chat/uploadCheckList', async (req, res) => {
  try {
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (req.files || Object.keys(req.files).length !== 0) {
      const result = await uploadCheckListService(req.files);
      if (result) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.details = result;
        data.message = 'File Uploaded Successfully';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Failed to upload';
        customResponse.messageCode = statusCode;
      }
    } else {
      responseType = BAD_REQUEST;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = 'File is missing, Please upload file';
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('upload checklist route: ', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/chat/askQuestion', async (req, res) => {
  try {
    const {
      query: { user_question = '' },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const { isValid, errors } = validate({ user_question });
    if (isValid) {
      let res = await chatQuestionService(req.query);
      if (res) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.details = res;
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
      customResponse.message = Object.values(errors)
        .flatMap((err) => Object.values(err))
        .filter((msg) => msg)
        .join(', ');
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('get file from s3 route', err);
    res.status(500).send(err);
  }
});

module.exports = router;