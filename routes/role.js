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
  getRoleService,
  getSingleRoleService,
  createRoleService,
} = require('../service/role_service');
const { validate } = require('../utils/helper');

router.get('/api/v1/roles', async (req, res) => {
  try {
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    let results = await getRoleService();
    if (results) {
      responseType = SUCCESS;
      statusCode = STATUS_CODE_SUCCESS;
      data.details = results;
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
    logger.error('get roles route', err);
    res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
  }
});

router.get('/api/v1/roles/:role_id', async (req, res) => {
  try {
    let {
      params: { role_id = null },
    } = req;
    role_id = parseInt(role_id);
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const { isValid, errors } = validate({}, {}, { role_id });
    if (isValid) {
      let res = await getSingleRoleService({ role_id });
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
      message = Object.values(errors)
        .flatMap((err) => Object.values(err))
        .filter((msg) => msg)
        .join(', ');
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('get single role route', err);
    res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
  }
});

router.post('/api/v1/roles/create', async (req, res) => {
  try {
    const {
      body: { role_name = '', role_desc = '' },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const { isValid, errors } = validate({ role_name, role_desc });
    if (isValid) {
      let res = await createRoleService(req.body);
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
      message = Object.values(errors)
        .flatMap((err) => Object.values(err))
        .filter((msg) => msg)
        .join(', ');
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('create role route', err);
    res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
  }
});

module.exports = router;
