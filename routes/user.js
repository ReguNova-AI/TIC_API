const express = require('express');
const router = new express.Router();
const { setResponse } = require('../utils/response');

const {
  SUCCESS,
  BAD_REQUEST,
  STATUS_CODE_SUCCESS,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_INVALID_SUCCESS,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
  CUSTOM_RESPONSE,
} = require('../constants/response_constants');
const { logger } = require('../utils/logger');
const {
  insertUserService,
  getUserService,
  getSignleUserService,
} = require('../service/user_service');

router.post('/api/v1/user/create', async (req, res) => {
  try {
    const {
      org_id,
      role_id,
      user_first_name,
      user_last_name,
      user_email,
      user_phone_no,
      user_password,
      created_by,
    } = req.body;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (
      org_id &&
      role_id &&
      user_first_name &&
      user_last_name &&
      user_email &&
      user_phone_no &&
      user_password &&
      created_by
    ) {
      let res = await insertUserService(req.body);
      if (res) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.details = res;
        data.message = 'Created User Successfully';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Failed to create user';
        customResponse.messageCode = statusCode;
      }
    } else {
      responseType = BAD_REQUEST;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = 'Details are required';
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('Project create route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/users', async (req, res) => {
  try {
    const {
      body: {},
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (req.body) {
      let res = await getUserService(req.body);
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
      responseType = BAD_REQUEST;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = 'Details are required';
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('get user route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/users/:user_id', async (req, res) => {
  try {
    let {
      params: { user_id = null },
    } = req;
    user_id = parseInt(user_id);
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (user_id) {
      let res = await getSignleUserService({ user_id });
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
      responseType = BAD_REQUEST;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = 'Details are required';
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('get single user route', err);
    res.status(500).send(err);
  }
});

module.exports = router;
