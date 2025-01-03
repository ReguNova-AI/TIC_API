const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');
const { TOKEN_EXPIRED_ERR } = require('../constants/constants');
const { loginQuery } = require('../dao/login_dao');

const authenticate = async (bearerToken) => {
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
      isValid: false,
    };
    const token = bearerToken.split(' ')[1];
    await jwt.verify(token, jwtSecretKey, async (err, decode) => {
      if (err) {
        if (err.toString() === TOKEN_EXPIRED_ERR) {
          data.isExpired = true;
        }
      } else {
        const { email = null, user_id = null, org_id = null } = decode;
        // const [{ user_id: db_user_id } = {}] = await loginQuery(
        //   'CHECK_IF_USER_EXISTS',
        //   { email },
        // );
        // if (user_id === db_user_id) {
        data.isValid = true;
        data.details = {
          email,
          user_id,
          org_id,
        };
        // }
        // return data;
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
