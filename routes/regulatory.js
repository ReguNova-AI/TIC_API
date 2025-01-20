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
  getRegulatoryService,
  createRegulatoryService,
} = require('../service/regulatory_service');
const { validate } = require('../utils/helper');

router.get('/api/v1/regulatories', async (req, res) => {
  try {
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    let results = await getRegulatoryService();
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
    logger.error('get regulatories route', err);
    res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
  }
});

router.post('/api/v1/regulatories/create', async (req, res) => {
  try {
    const {
      body: {
        industry_id = '',
        industry_name = '',
        standard_name = '',
        standard_url = '',
      },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const { isValid, errors } = validate(
      { industry_name, standard_name, standard_url },
      {},
      { industry_id },
    );
    if (isValid) {
      let results = await createRegulatoryService(req.body);
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
    logger.error('create regulatories route', err);
    res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
  }
});

module.exports = router;
