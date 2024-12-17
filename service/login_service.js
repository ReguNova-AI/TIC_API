const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const { smtpTransporter } = require('../config/aws_config');
const { loginQuery, forgotPasswordQuery } = require('../dao/login_dao');
const { logger } = require('../utils/logger');
const { getOtp, getToken, getRefreshToken } = require('../utils/helper');
const {
  TOKEN_EXPIRED_ERR,
  INVALID_EMAIL,
  INVALID_PASSWORD,
} = require('../constants/response_constants');

const loginService = async (email, password) => {
  try {
    let loginParams = { email, password };
    let loginResObj = {};

    let [{ user_id: personId = null, user_password = null } = {}] =
      await loginQuery('CHECK_IF_USER_EXISTS', loginParams);
    if (!personId) {
      loginResObj.message = INVALID_EMAIL;
      return loginResObj;
    }
    if (password != user_password) {
      loginResObj.message = INVALID_PASSWORD;
      return loginResObj;
    }
    const userDetails =
      (await loginQuery('GET_USER_DETAILS', loginParams)) || [];
    const user_id = userDetails[0].user_id;
    if (Array.isArray(userDetails) && userDetails.length > 0) {
      let data = {
        email,
        user_id,
      };

      // what and all we have to consider for generating the tokens

      const token = getToken(data);
      // const tokenHash = crypto.createHash('md5').update(token).digest('hex');
      await loginQuery('UPDATE_USER_TOKEN', { tokenHash: token, user_id });
      const refreshToken = getRefreshToken(data);
      // const refreshTokenHash = crypto
      //   .createHash('md5')
      //   .update(refreshToken)
      //   .digest('hex');
      await loginQuery('UPDATE_REFRESH_TOKEN', {
        refreshTokenHash: refreshToken,
        user_id,
      });

      loginResObj.token = token;
      loginResObj.refreshToken = refreshToken;
      loginResObj.userDetails = userDetails;
      loginResObj.user_id = user_id;
    }
    return loginResObj;
  } catch (error) {
    logger.error('login service', error);
  }
};

const forgotPasswordService = async (params) => {
  try {
    let data = {
      isEmailSent: false,
    };
    const [{ user_id: userId = 0 }] = await loginQuery(
      'CHECK_IF_USER_EXISTS',
      params,
    );
    if (userId) {
      const otp = getOtp();
      // const otpHash = crypto.createHash('md5').update(otp).digest('hex');
      // const email = params.email;

      // const mailOptions = {
      //   from: process.env.FROM,
      //   to: email.toLowerCase(),
      //   text: otp,
      //   subject: 'OTP for TIC validation',
      //   html: `<p>Hello please enter the below OTP,</p>
      //         <p><b>${otp}</b></p>
      //         <p>Note: This is an auto-generated email. Please do not reply to it.</p>
      //         <p>Thanks,<br>Team TIC</p>`,
      // };

      // await smtpTransporter.sendMail(mailOptions);
      data.isEmailSent = true;
      data.userId = userId;
      await forgotPasswordQuery('UPDATE_USER_OTP', { userHash: otp, userId });
    }
    return data;
  } catch (error) {
    logger.error('Forgot password service error:', error);
    throw error;
  }
};

const verifyOtpService = async (params) => {
  try {
    let data = {
      isOtpValid: false,
    };

    const [
      {
        user_id: userId = 0,
        otpHash: storedOtpHash = '',
        // otp_expiry: otpExpiry,
      },
    ] = await forgotPasswordQuery('GET_USER_OTP_DETAILS', params);

    if (userId) {
      const { otp } = params;
      params.userId = userId;

      // const providedOtpHash = crypto
      //   .createHash('md5')
      //   .update(otp)
      //   .digest('hex');

      // const isOtpNotExpired = new Date() <= new Date(otpExpiry);
      // if (storedOtpHash === params.otp && isOtpNotExpired) {
      if (storedOtpHash === params.otp) {
        data.isOtpValid = true;
        await forgotPasswordQuery('CLEAR_USER_OTP', { userId });
      }
    }

    return data;
  } catch (error) {
    logger.error('Verify OTP service error', error);
    throw error;
  }
};

const refreshTokenService = async (refreshToken) => {
  try {
    let jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;
    let data = {
      isExpired: true,
      isRefreshValid: true,
      isRefreshExpired: false,
    };
    let token = '';
    let refreshTokenNew = '';
    await jwt.verify(
      refreshToken,
      jwtRefreshSecretKey,
      async (err, decoded) => {
        if (err) {
          if (err.toString() == TOKEN_EXPIRED_ERR) {
            data.isRefreshExpired = true;
          } else {
            data.isRefreshValid = false;
          }
        } else {
          const { email = null } = decoded;
          if (email) {
            let checkRefreshTokenParams = { email };
            const [
              {
                user_id = null,
                refreshToken: referenceRefreshToken = null,
              } = {},
            ] = await loginQuery(
              'CHECK_IF_USER_EXISTS',
              checkRefreshTokenParams,
            );
            // const comparisionToken = crypto
            //   .createHash('md5')
            //   .update(refreshToken)
            //   .digest('hex');
            if (refreshToken === referenceRefreshToken) {
              let tokenData = { email, user_id };
              token = getToken(tokenData);
              refreshTokenNew = getRefreshToken(tokenData);
              // const tokenNewHash = crypto
              //   .createHash('md5')
              //   .update(token)
              //   .digest('hex');
              await loginQuery('UPDATE_USER_TOKEN', {
                tokenHash: token,
                user_id,
              });
              // const refreshTokenNewHash = crypto
              //   .createHash('md5')
              //   .update(refreshTokenNew)
              //   .digest('hex');
              await loginQuery('UPDATE_REFRESH_TOKEN', {
                refreshTokenHash: refreshTokenNew,
                user_id,
              });
            } else {
              data.isRefreshValid = false;
            }
          } else {
            data.isRefreshValid = false;
          }
        }
      },
    );
    data.token = token;
    data.refreshTokenNew = refreshTokenNew;
  } catch (err) {
    logger.error('Refresh token service error:', err);
  }
};

const resetPasswordService = async (params) => {
  try {
    const [{ user_id: userId = 0 } = {}] = await loginQuery(
      'CHECK_IF_USER_EXISTS',
      params,
    );
    if (userId > 0) {
      // const passwordHash = crypto
      //   .createHash('md5')
      //   .update(password)
      //   .digest('hex');
      const passwordParams = { passwordHash: params.password, userId };
      await forgotPasswordQuery('UPDATE_USER_PASSWORD', passwordParams);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error('reset password service', error);
  }
};

module.exports = {
  loginService,
  forgotPasswordService,
  verifyOtpService,
  refreshTokenService,
  resetPasswordService,
};
