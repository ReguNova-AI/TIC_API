const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');
const { TOKEN_EXPIRED_ERR } = require('../constants/constants');
// const { loginQuery } = require('../dao/login_dao');

const authenticate = async (bearerToken) => {
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
      isValid: false,
    };
    const token = bearerToken.split(' ')[1];
    jwt.verify(token, jwtSecretKey, (err, decode) => {
      if (err) {
        if (err.toString() === TOKEN_EXPIRED_ERR) {
          data.isExpired = true;
        }
      } else {
        const { email = null, user_id = null } = decode;
        data.isValid = true;
        data.details = {
          email,
          user_id,
        };
      }
    });
    return data;
  } catch (err) {
    logger.error('authenticate service', err);
  }
};

module.exports = {
  authenticate,
};
