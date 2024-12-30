const express = require('express');
const router = new express.Router();
const { setResponse } = require('../utils/response');
const { validate } = require('../utils/helper');

const {
  SUCCESS,
  BAD_REQUEST,
  STATUS_CODE_SUCCESS,
  STATUS_CODE_BAD_REQUEST,
  CUSTOM_RESPONSE,
} = require('../constants/response_constants');
const { logger } = require('../utils/logger');
const {
  getOrgService,
  getSignleOrgService,
  createOrgService,
  getIndustryService,
  getSingleIndustryService,
  createIndustryService,
  getSectorsService,
  getSingleSectorService,
  createSectorService,
  getOrgDetailsExistService,
} = require('../service/generic_service');

router.get('/api/v1/organizations/exist', async (req, res) => {
  try {
    let {
      query: { org_name = null, org_email = null },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const { isValid, errors } = validate({ org_name }, { org_email }, {});
    if (isValid) {
      let org_id = await getOrgDetailsExistService(req.query);
      if (org_id) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.message =
          'Organization name and email are already exists, please try again.';
      } else {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.message = 'Organization name and email are not exists';
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
    logger.error('get organization exist route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/organizations', async (req, res) => {
  try {
    const {
      body: {},
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (req.body) {
      let res = await getOrgService(req.body);
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
    logger.error('get organizations route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/organizations/:org_id', async (req, res) => {
  try {
    let {
      params: { org_id = null },
    } = req;
    org_id = parseInt(org_id);
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (org_id) {
      let res = await getSignleOrgService({ org_id });
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
    logger.error('get single organization route', err);
    res.status(500).send(err);
  }
});

router.post('/api/v1/organizations/create', async (req, res) => {
  try {
    const {
      body: {
        sector_id = null,
        sector_name = null,
        industries = null,
        industry_names = null,
        org_name = null,
        org_email = null,
        contact_json = null,
      },
    } = req;
    const { isValid, errors } = validate(
      { org_name, sector_name },
      { org_email },
      { sector_id },
    );
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (isValid) {
      let res = await createOrgService(req.body);
      if (res) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.details = res;
        data.message = 'Created Organization Successfully';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Failed to create Organization';
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
    logger.error('create organization route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/industries', async (req, res) => {
  try {
    const {
      body: {},
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (req.body) {
      let res = await getIndustryService(req.body);
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
    logger.error('get industries route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/industries/:industry_id', async (req, res) => {
  try {
    let {
      params: { industry_id = null },
    } = req;
    industry_id = parseInt(industry_id);
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (industry_id) {
      let res = await getSingleIndustryService({ industry_id });
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
    logger.error('get single industry route', err);
    res.status(500).send(err);
  }
});

router.post('/api/v1/industries/create', async (req, res) => {
  try {
    const {
      body: {
        industry_name = null,
        industry_description = null,
        sector_id = null,
        sector_name = null,
      },
    } = req;
    const { isValid, errors } = validate(
      { industry_name, industry_description, sector_name },
      {},
      { sector_id },
    );
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (isValid) {
      let res = await createIndustryService(req.body);
      if (res) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.details = res;
        data.message = 'Created industry Successfully';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Failed to create industry';
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
    logger.error('create industry route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/sectors', async (req, res) => {
  try {
    const {
      body: {},
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (req.body) {
      let res = await getSectorsService(req.body);
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
    logger.error('get sectors route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/sectors/:sector_id', async (req, res) => {
  try {
    let {
      params: { sector_id = null },
    } = req;
    sector_id = parseInt(sector_id);
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (sector_id) {
      let res = await getSingleSectorService({ sector_id });
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
    logger.error('get single sector route', err);
    res.status(500).send(err);
  }
});

router.post('/api/v1/sectors/create', async (req, res) => {
  try {
    const {
      body: { sector_name = null, sector_desc = null },
    } = req;
    const { isValid, errors } = validate({ sector_name });
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (isValid) {
      let res = await createSectorService(req.body);
      if (res) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.details = res;
        data.message = 'Created sector Successfully';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Failed to create sector';
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
    logger.error('create sector route', err);
    res.status(500).send(err);
  }
});

module.exports = router;
