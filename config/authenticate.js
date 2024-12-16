const { logger } = require('../utils/logger');
const { TOKEN_EXPIRED_ERR } = require('../constants/constants');
const { loginQuery } = require('../dao/login_dao');

const authenticate = async (token) => {
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
      isValid: false,
    };
    let email = null;
    jwt.verify(token, jwtSecretKey, (err, decoded) => {
      if (err) {
        if (err.toString() === TOKEN_EXPIRED_ERR) {
          data.isValid = true;
          data.isExpired = true;
        }
      } else {
        const { email: decodedEmail = null } = decoded;
        email = decodedEmail;
      }
    });
    if (email) {
      const [{ id = null } = {}] = await loginQuery('CHECK_IF_USER_EXISTS', {
        email,
      });
      if (id) {
        const [userDetails = {}] = await loginQuery('GET_USER_DETAILS', {
          id,
        });
        data.details = userDetails;
        data.isValid = true;
      }
    }
    return data;
  } catch (err) {
    logger.error('authenticate service', err);
  }
};

module.exports = {
  authenticate,
};
