const express = require('express');
const router = new express.Router();
const { setResponse } = require('../utils/response');
const {
  loginService,
  forgotPasswordService,
  verifyOtpService,
  refreshTokenService,
  resetPasswordService,
  logoutService,
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
  STATUS_CODE_UNAUTHORISED,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_INVALID,
  INVALID_EMAIL,
  LOGOUT_SUCCESS,
} = require('../constants/response_constants');
const { logger } = require('../utils/logger');
const { validate } = require('../utils/helper');

router.post('/api/v1/login', async (req, res) => {
  try {
    const {
      body: { email = '', password = '' },
    } = req;

    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const { isValid, errors } = validate({}, { email }, {}, { password });
    if (isValid) {
      // validations for email and password
      const { token, refreshToken, userDetails, user_id, message } =
        await loginService(email, password);
      if (userDetails && user_id > 0) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.token = token;
        data.refreshToken = refreshToken;
        data.userDetails = userDetails;
        data.message = 'Logged in successfully';
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_INTERNAL_SERVER_ERROR;
        customResponse.statusCode = statusCode;
        customResponse.message = message;
        customResponse.messageCode = STATUS_CODE_INTERNAL_SERVER_ERROR;
      }
    } else {
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = Object.values(errors)
        .flatMap((err) => Object.values(err))
        .filter((msg) => msg)
        .join(', ');
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
    const { isValid, errors } = validate({}, { email });
    if (isValid) {
      let { isEmailSent, userId } = await forgotPasswordService(req.body);
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

    const { isValid, errors } = validate({ otp }, { email });
    if (isValid) {
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
    const { isValid, errors } = validate({}, { email }, {}, { password });
    if (isValid) {
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
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = Object.values(errors)
        .flatMap((err) => Object.values(err))
        .filter((msg) => msg)
        .join(', ');
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
      body: { refreshToken = '' },
    } = req;
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    let data = {};
    const { isValid, errors } = validate({ refreshToken });
    if (isValid) {
      const {
        isRefreshValid = false,
        isRefreshExpired = false,
        token = null,
        refreshTokenNew = null,
      } = await refreshTokenService(refreshToken);
      if (isRefreshExpired) {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_UNAUTHORISED;
        customResponse.statusCode = statusCode;
        customResponse.message = REFRESH_TOKEN_EXPIRED;
        customResponse.messageCode = STATUS_CODE_UNAUTHORISED;
      } else if (isRefreshValid) {
        data.token = token;
        data.refreshTokenNew = refreshTokenNew;
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_INVALID_SUCCESS;
        customResponse.statusCode = statusCode;
        customResponse.message = REFRESH_TOKEN_INVALID;
        customResponse.messageCode = STATUS_CODE_INVALID_SUCCESS;
      }
    } else {
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = Object.values(errors)
        .flatMap((err) => Object.values(err))
        .filter((msg) => msg)
        .join(', ');
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

router.post('/api/v1/logout', async (req, res) => {
  try {
    const {
      query: { user_id = null },
    } = req;
    let data = {};
    let responseType = '';
    let statusCode = '';
    let customResponse = {};
    const { isValid, errors } = validate({}, {}, { user_id });
    if (isValid) {
      const isLoggedOut = await logoutService({ user_id });
      if (isLoggedOut) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.isLoggedOut = isLoggedOut;
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_INTERNAL_SERVER_ERROR;
        customResponse.statusCode = statusCode;
        customResponse.message = 'Internal Server Error';
        customResponse.messageCode = STATUS_CODE_INTERNAL_SERVER_ERROR;
      }
    } else {
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = Object.values(errors)
        .flatMap((err) => Object.values(err))
        .filter((msg) => msg)
        .join(', ');
    }
    let response = setResponse(
      responseType,
      LOGOUT_SUCCESS,
      data,
      customResponse,
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error('logout route', err);
    res.status(500).send(err);
  }
});

module.exports = router;
