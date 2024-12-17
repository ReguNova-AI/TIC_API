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
  projectService,
  getProjectService,
} = require('../service/project_service');

router.post('/api/v1/project/create', async (req, res) => {
  try {
    const {
      body: {
        // project_name,
        // project_no,
        // project_description,
        // regulatory_standard,
        // invite_members,
        // documents,
        // org_id,
        // org_name,
        // created_by_id,
        // created_by_name,
        // sector_id,
        // sector_name,
        // industry_id,
        // industry_name,
        // status,
        // no_of_runs,
        // success_count,
        // fail_count,
        // last_run,
        // mapping_standards,
        // summary_report
      },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (req.body) {
      let res = await projectService(req.body);
      if (res) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
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

router.get('/api/v1/projects', async (req, res) => {
  try {
    const {
      body: {},
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (req.body) {
      let res = await getProjectService(req.body);
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
    logger.error('Project create route', err);
    res.status(500).send(err);
  }
});

module.exports = router;
