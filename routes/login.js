const express = require('express');
const router = new express.Router();
const { setResponse } = require('../utils/response');
const {
  loginService,
  forgotPasswordService,
  verifyOtpService,
  refreshTokenService,
  resetPasswordService,
} = require('../service/login_service');
const {
  SUCCESS,
  BAD_REQUEST,
  STATUS_CODE_SUCCESS,
  STATUS_CODE_BAD_REQUEST,
  LOGIN_SUCCESS,
  USER_NOT_FOUND,
  STATUS_CODE_INVALID_SUCCESS,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
  INVALID_DETAILS,
  CUSTOM_RESPONSE,
  RESET_PASSWORD_SUCCESS,
} = require('../constants/response_constants');
const { logger } = require('../utils/logger');

router.post('/api/v1/login', async (req, res) => {
  try {
    const {
      body: { email = '', password = '' },
    } = req;

    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (email && password) {
      // validations for email and password
      const { token, refreshToken, userDetails, user_id } = await loginService(
        email,
        password,
      );
      if (userDetails && user_id > 0) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.token = token;
        data.refreshToken = refreshToken;
        data.userDetails = userDetails;
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_INTERNAL_SERVER_ERROR;
        customResponse.statusCode = statusCode;
        customResponse.message = USER_NOT_FOUND;
        customResponse.messageCode = STATUS_CODE_INTERNAL_SERVER_ERROR;
      }
    } else {
      responseType = BAD_REQUEST;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.statusCode = statusCode;
      customResponse.message = INVALID_DETAILS;
    }
    let response = setResponse(
      responseType,
      LOGIN_SUCCESS,
      data,
      customResponse,
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('login route', err);
    res.status(500).send(err);
  }
});

router.post('/api/v1/forgotPassword/sendOtp', async (req, res) => {
  try {
    const {
      body: { email = '' },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (email) {
      let resetPasswordParams = { email };
      let { isEmailSent, userId } =
        await forgotPasswordService(resetPasswordParams);
      if (isEmailSent && userId) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.message = 'OTP sent successfully to your email';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Failed to send OTP email';
        customResponse.messageCode = statusCode;
      }
    } else {
      responseType = BAD_REQUEST;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = 'Email is required';
    }
    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('forgot password route', err);
    res.status(500).send(err);
  }
});

router.post('/api/v1/forgotPassword/verifyOtp', async (req, res) => {
  try {
    const {
      body: { email = '', otp = '' },
    } = req;

    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};

    if (email && otp) {
      const { isOtpValid } = await verifyOtpService({ email, otp });

      if (isOtpValid) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.message = 'OTP verified successfully';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_UNAUTHORIZED;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Invalid or expired OTP';
        customResponse.messageCode = STATUS_CODE_UNAUTHORIZED;
      }
    } else {
      responseType = BAD_REQUEST;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = 'Email and OTP are required';
      customResponse.messageCode = STATUS_CODE_BAD_REQUEST;
    }

    let response = setResponse(responseType, '', data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('verify OTP route', err);
    res.status(500).send(err);
  }
});

router.post('/api/v1/resetPassword', async (req, res) => {
  try {
    const {
      body: { email = '', password = '' },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    if (email && password) {
      let resetPasswordParams = { email, password };
      const isPasswordUpdated = await resetPasswordService(resetPasswordParams);
      if (isPasswordUpdated) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_INVALID_SUCCESS;
        customResponse.statusCode = statusCode;
        customResponse.message = INVALID_EMAIL;
        customResponse.messageCode = STATUS_CODE_INVALID_SUCCESS;
      }
    } else {
      responseType = BAD_REQUEST;
      statusCode = STATUS_CODE_BAD_REQUEST;
    }
    let response = setResponse(
      responseType,
      RESET_PASSWORD_SUCCESS,
      data,
      customResponse,
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('post resetPassword route', err);
    res.status(500).send(err);
  }
});

router.get('/api/v1/refreshToken', async (req, res) => {
  try {
    const {
      headers: { accesstoken = '', refreshtoken = '' },
    } = req;
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    let data = {};
    if (accesstoken && refreshtoken) {
      const {
        isRefreshValid = false,
        isRefreshExpired = false,
        token = null,
        refreshToken = null,
      } = await refreshTokenService(accesstoken, refreshtoken);
      if (isRefreshExpired) {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_UNAUTHORISED;
        customResponse.statusCode = statusCode;
        customResponse.message = REFRESH_TOKEN_EXPIRED;
        customResponse.messageCode = STATUS_CODE_UNAUTHORISED;
      } else if (isRefreshValid) {
        data.token = token;
        data.refreshToken = refreshToken;
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_INVALID_SUCCESS;
        customResponse.statusCode = statusCode;
        customResponse.message = REFRESH_TOKEN_INVALID;
        customResponse.messageCode = MESSAGE_CODE_INVALID_SUCCESS;
      }
    } else {
      responseType = BAD_REQUEST;
      statusCode = STATUS_CODE_BAD_REQUEST;
    }
    let response = setResponse(
      responseType,
      LOGIN_SUCCESS,
      data,
      customResponse,
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('get refreshToken route', err);
    res.status(500).send(err);
  }
});

module.exports = router;
