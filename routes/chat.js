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
  uploadStandardChatService,
  uploadStandardCheckListService,
  uploadProjectDocsService,
  chatDataService,
  chatRunComplainceAssessmentService,
  uploadStandardCheckListService2,
} = require('../service/chat_service');
const { validate } = require('../utils/helper');

const fileUpload = require('express-fileupload');
router.use(fileUpload());

router.post('/api/v1/chat/uploadStandardChat', async (req, res) => {
  try {
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const result = await uploadStandardChatService();
    if (result) {
      responseType = SUCCESS;
      statusCode = STATUS_CODE_SUCCESS;
      data = result;
      data.message = 'Uploaded Successfully';
    } else {
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.statusCode = statusCode;
      customResponse.message = 'Failed to get response';
      customResponse.messageCode = statusCode;
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
      customResponse.message = Object.values(errors)
        .flatMap((err) => Object.values(err))
        .filter((msg) => msg)
        .join(', ');
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('ask a question to chatAI route', err);
    res.status(500).send(err);
  }
});

router.post('/api/v1/chat/uploadStandardCheckList', async (req, res) => {
  try {
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const result = await uploadStandardCheckListService();
    if (result) {
      responseType = SUCCESS;
      statusCode = STATUS_CODE_SUCCESS;
      data = result;
      data.message = 'Checklist Uploaded Successfully';
    } else {
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.statusCode = statusCode;
      customResponse.message = 'Failed to get response';
      customResponse.messageCode = statusCode;
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('upload standard checklist route: ', err);
    res.status(500).send(err);
  }
});

router.post('/api/v2/chat/uploadStandardCheckList', async (req, res) => {
  try {
    const {
      query: { imageKey = '' },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const result = await uploadStandardCheckListService2(imageKey);
    if (result.success) {
      responseType = SUCCESS;
      statusCode = STATUS_CODE_SUCCESS;
      data = result;
      data.message = 'Checklist Uploaded Successfully';
    } else {
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.statusCode = statusCode;
      customResponse.message = 'Failed to upload';
      customResponse.messageCode = statusCode;
      data = result;
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('upload standard checklist route: ', err);
    res.status(500).send(err);
  }
});

router.post('/api/v1/chat/uploadProjectDocs', async (req, res) => {
  try {
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    // if (req.files || Object.keys(req.files).length > 0) {
    // const result = await uploadProjectDocsService(req.files);
    const result = await uploadProjectDocsService();
    if (result.ok) {
      responseType = SUCCESS;
      statusCode = STATUS_CODE_SUCCESS;
      data.details = result;
      data.message = 'Documents Uploaded Successfully';
    } else {
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.statusCode = statusCode;
      customResponse.message = 'Failed to upload';
      customResponse.messageCode = statusCode;
    }
    // } else {
    //   responseType = BAD_REQUEST;
    //   statusCode = STATUS_CODE_BAD_REQUEST;
    //   customResponse.message = 'File is missing, Please upload file';
    // }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('upload project docs route: ', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/chat/data', async (req, res) => {
  try {
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    let details = await chatDataService();
    if (details) {
      responseType = SUCCESS;
      statusCode = STATUS_CODE_SUCCESS;
      data = details;
      data.message = 'Fetched Details Successfully';
    } else {
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.statusCode = statusCode;
      customResponse.message = 'Failed to get response';
      customResponse.messageCode = statusCode;
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('get file from s3 route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/chat/runComplainceAssessment', async (req, res) => {
  try {
    const {
      query: { requirements = '' },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    let message = '';
    if (requirements.length > 0) {
      let details = await chatRunComplainceAssessmentService(requirements);
      if (details) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data = details;
        data.message = 'Fetched Details Successfully';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Failed to get response';
        customResponse.messageCode = statusCode;
      }
    } else {
      responseType = BAD_REQUEST;
      statusCode = STATUS_CODE_BAD_REQUEST;
      message = 'requirements is required';
    }
    let response = setResponse(responseType, message, data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('get file from s3 route', err);
    res.status(500).send(err);
  }
});

module.exports = router;
