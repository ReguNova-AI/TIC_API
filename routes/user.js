const express = require('express');
const router = new express.Router();
const { setResponse } = require('../utils/response');
const { validate } = require('../utils/helper');

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
  getUserExistService,
  getOrgUserService,
  updateUserService,
  getOrgUserCountService,
  getSaUserCountService,
} = require('../service/user_service');

router.post('/api/v1/user/create', async (req, res) => {
  try {
    const {
      org_id,
      role_id,
      role_name,
      user_first_name,
      user_last_name,
      user_email,
      user_phone_no,
      created_by,
    } = req.body;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const { isValid, errors } = validate(
      { user_first_name, user_last_name, user_phone_no, role_name },
      { user_email },
      { org_id, role_id, created_by },
    );
    if (isValid) {
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
    logger.error('Project create route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/users/exist', async (req, res) => {
  try {
    let {
      query: { email = null },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const { isValid, errors } = validate({}, { email });
    if (isValid) {
      let res = await getUserExistService({ email });
      if (res) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.message = 'User exist';
      } else {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.message = 'User not exist';
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
    logger.error('get user exist route', err);
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
    let details = await getUserService();
    if (details) {
      responseType = SUCCESS;
      statusCode = STATUS_CODE_SUCCESS;
      data.details = details;
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
    logger.error('get user route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/users/:user_id', async (req, res) => {
  try {
    let {
      params: { user_id = null },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const { isValid, errors } = validate({}, {}, { user_id });
    if (isValid) {
      let res = await getSignleUserService(req.query);
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
    logger.error('get single user route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/org/users', async (req, res) => {
  try {
    let {
      query: { industry_id = null, org_id = null },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    industry_id = parseInt(industry_id);
    const { isValid, errors } = validate({}, {}, { org_id });
    if (isValid) {
      let res = await getOrgUserService({ org_id, industry_id });
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
    logger.error('get org users route', err);
    res.status(500).send(err);
  }
});

router.put('/api/v1/user/update', async (req, res) => {
  try {
    const {
      org_id,
      role_id,
      role_name,
      user_first_name,
      user_last_name,
      user_email,
      user_phone_no,
      user_id,
    } = req.body;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const { isValid, errors } = validate(
      { user_first_name, user_last_name, user_phone_no, role_name },
      { user_email },
      { org_id, role_id, user_id },
    );
    if (isValid) {
      let res = await updateUserService(req.body);
      if (res) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.details = res;
        data.message = 'Updated User Successfully';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Failed to update user';
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
    logger.error('User update  route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/org/userCount', async (req, res) => {
  try {
    let {
      query: { industry_id = null, org_id = null },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    industry_id = parseInt(industry_id);
    const { isValid, errors } = validate({}, {}, { org_id });
    if (isValid) {
      let response = await getOrgUserCountService({ org_id, industry_id });
      if (response) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data = response;
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
    logger.error('get org user count route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/sa/userCount', async (req, res) => {
  try {
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    let details = await getSaUserCountService();
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
    logger.error('get sa user count route', err);
    res.status(500).send(err);
  }
});

module.exports = router;
