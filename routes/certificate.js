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
  getCertificateService,
  getSingleCertificateService,
  insertCertificateService,
} = require('../service/certificate_service');

router.get('/api/v1/certificates', async (req, res) => {
  try {
    let {
      query: { user_id = '' },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    user_id = parseInt(user_id);
    if (user_id) {
      let res = await getCertificateService({ user_id });
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
    logger.error('get certificates route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/certificates/:certificate_id', async (req, res) => {
  try {
    let {
      params: { certificate_id = null },
    } = req;
    certificate_id = parseInt(certificate_id);
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (certificate_id) {
      let res = await getSingleCertificateService({ certificate_id });
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
    logger.error('get certificate route', err);
    res.status(500).send(err);
  }
});

router.post('/api/v1/certificate/create', async (req, res) => {
  try {
    const {
      body: {
        certificate_name = null,
        certificate_subject = null,
        certificate_status = null,
        issuer = null,
        file_url = null,
        file_name = null,
        created_by_id = null,
      },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (
      certificate_name &&
      certificate_subject &&
      certificate_status &&
      issuer &&
      file_url &&
      file_name &&
      created_by_id
    ) {
      let res = await insertCertificateService(req.body);
      if (res) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.details = res;
        data.message = 'Created Certificate Successfully';
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
    logger.error('create certificate route', err);
    res.status(500).send(err);
  }
});

module.exports = router;
