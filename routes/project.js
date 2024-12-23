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
  getSingleProjectService,
  projectUpdateService,
} = require('../service/project_service');

router.post('/api/v1/project/create', async (req, res) => {
  try {
    const {
      body: {
        project_name = null,
        project_no = null,
        project_description = null,
        regulatory_standard = null,
        // invite_members = null,
        // documents = null,
        // org_id = null,
        // org_name = null,
        // created_by_id = null,
        // created_by_name = null,
        // sector_id = null,
        // sector_name = null,
        // industry_id = null,
        // industry_name = null,
        // status = null,
        // last_run = null,
        // mapping_standards = null,
        // summary_report = null,
      },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (
      project_name &&
      project_no &&
      project_description &&
      regulatory_standard
    ) {
      let response = await projectService(req.body);
      if (response) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.details = response;
        data.message = 'Project Created Successfully';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Failed to create project';
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
    logger.error('Get Projects route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/projects/:project_id', async (req, res) => {
  try {
    let {
      params: { project_id = null },
    } = req;
    project_id = parseInt(project_id);
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (project_id) {
      let res = await getSingleProjectService({ project_id });
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
    logger.error('Get Single project route', err);
    res.status(500).send(err);
  }
});

router.put('/api/v1/project/update', async (req, res) => {
  try {
    const {
      body: {
        project_name = null,
        project_no = null,
        project_description = null,
        regulatory_standard = null,
        project_id = null,
      },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (
      project_name &&
      project_no &&
      project_description &&
      regulatory_standard &&
      project_id
    ) {
      let response = await projectUpdateService(req.body);
      if (response) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.details = response;
        data.message = 'Project Updated Successfully';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Failed to create project';
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
    logger.error('Project update route', err);
    res.status(500).send(err);
  }
});

module.exports = router;
