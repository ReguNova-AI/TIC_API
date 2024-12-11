const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const { smtpTransporter } = require('../config/aws_config');
const { loginQuery, forgotPasswordQuery } = require('../dao/login_dao');
const { logger } = require('../utils/logger');
const { getOtp, getToken, getRefreshToken } = require('../utils/helper');

const loginService = async (email, password) => {
  try {
    let loginParams = { email, password };
    let loginResObj = {};

    const userDetails = await loginQuery('GET_USER_DETAILS', loginParams);
    if (userDetails) {
      let data = {
        email,
        user_id: userDetails[0].user_id,
      };

      const token = getToken(data);
      const refreshToken = getRefreshToken(data);
      const refreshTokenHash = crypto
        .createHash('md5')
        .update(refreshToken)
        .digest('hex');
      await loginQuery('UPDATE_REFRESH_TOKEN', {
        refreshTokenHash,
        userId: data.user_id,
      });

      loginResObj.jwtToken = token;
      loginResObj.refreshToken = refreshToken;
      loginResObj.userDetails = userDetails;
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
    const [{ user_id: userId = 0 }] = await forgotPasswordQuery(
      'CHECK_IF_USER_EXISTS',
      params,
    );
    if (userId) {
      const otp = getOtp();
      const otpHash = crypto.createHash('md5').update(otp).digest('hex');
      const email = params.email;

      const mailOptions = {
        from: process.env.FROM,
        to: email.toLowerCase(),
        text: otp,
        subject: 'OTP for TIC validation',
        html: `<p>Hello please enter the below OTP,</p>
              <p><b>${otp}</b></p>
              <p>Note: This is an auto-generated email. Please do not reply to it.</p>
              <p>Thanks,<br>Team TIC</p>`,
      };

      await smtpTransporter.sendMail(mailOptions);
      data.isEmailSent = true;
      data.userId = userId;
      await forgotPasswordQuery('UPDATE_USER_OTP', { otpHash, userId });
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

      const providedOtpHash = crypto
        .createHash('md5')
        .update(otp)
        .digest('hex');

      // const isOtpNotExpired = new Date() <= new Date(otpExpiry);
      // if (storedOtpHash === providedOtpHash && isOtpNotExpired) {
      //   data.isOtpValid = true;
      await forgotPasswordQuery('CLEAR_USER_OTP', { userId });
      // }
    }

    return data;
  } catch (error) {
    logger.error('Verify OTP service error', error);
    throw error;
  }
};

const refreshTokenService = async (accessToken, refreshToken) => {
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;
    let data = {
      isExpired: true,
      isRefreshValid: true,
      isRefreshExpired: false,
    };
    let token = '';
    let refreshTokenNew = '';
    await jwt.verify(accessToken, jwtSecretKey, async (err) => {
      if (err) {
        if (err.toString() == TOKEN_EXPIRED_ERR) {
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
                      id: personId = null,
                      refreshToken: referenceRefreshToken = null,
                    } = {},
                  ] = await registerQuery(
                    'CHECK_USER',
                    checkRefreshTokenParams,
                  );
                  const comparisionToken = crypto
                    .createHash('md5')
                    .update(refreshToken)
                    .digest('hex');
                  if (comparisionToken === referenceRefreshToken) {
                    let tokenData = { email, userId: personId };
                    token = getToken(tokenData);
                    refreshTokenNew = getRefreshToken(tokenData);
                    const refreshTokenNewHash = crypto
                      .createHash('md5')
                      .update(refreshTokenNew)
                      .digest('hex');
                    await loginQuery('UPDATE_REFRESH_TOKEN', {
                      refreshTokenNewHash,
                      personId,
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
        }
      } else {
        data.isExpired = false;
      }
    });
    data.token = token;
    data.refreshToken = refreshTokenNew;
  } catch (err) {
    logger.error('Refresh token service error:', err);
  }
};

const resetPasswordService = async (params) => {
  try {
    const { email, password } = params;
    const [{ user_id: userId = 0 } = {}] = await loginQuery(
      'CHECK_IF_USER_EXISTS',
      params,
    );
    if (userId > 0) {
      const passwordHash = crypto
        .createHash('md5')
        .update(password)
        .digest('hex');
      const passwordParams = { passwordHash, userId };
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
