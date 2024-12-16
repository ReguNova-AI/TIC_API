const { connectDB } = require('../config/database');
const { logger } = require('../utils/logger');

var pool = connectDB();

const loginQuery = async (queryType, params = {}) => {
  try {
    let query1 = '';
    switch (queryType) {
      case 'GET_USER_DETAILS':
        query1 = `SELECT 
                    u.user_id,
                    u.user_first_name,
                    u.user_last_name,
                    u.user_email,
                    u.user_phone_no,
                    u.user_profile,
                    u.user_address,
                    u.created_date,
                    u.updated_date,
                    o.org_id,
                    o.org_name,
                    o.org_email,
                    o.org_logo,
                    o.org_address,
                    r.role_id,
                    r.role_name,
                    r.role_desc,
                    r.permissions
                FROM 
                    users u
                LEFT JOIN 
                    organizations o ON u.org_id = o.org_id
                LEFT JOIN 
                    roles r ON u.role_id = r.role_id 
                WHERE 
                    u.user_email = '${params.email}' and u.user_password = '${params.password}';`;
        break;
      case 'UPDATE_USER_TOKEN':
        query1 = `UPDATE users SET token = '${params.tokenHash}' 
                WHERE user_id = ${params.user_id};`;
        break;
      case 'UPDATE_REFRESH_TOKEN':
        query1 = `UPDATE users SET refreshToken = '${params.refreshTokenHash}' 
                WHERE user_id = ${params.userId};`;
        break;
      case 'CHECK_IF_USER_EXISTS':
        query1 = `SELECT user_id FROM users WHERE user_email = '${params.email}';`;
        break;
    }

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query(query1, Object.values(params), (err, results) => {
          connection.release();
          if (err) {
            logger.error(`login dao ${queryType}`, err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  } catch (err) {
    logger.error('login dao', err);
  }
};

const forgotPasswordQuery = async (queryType, params = {}) => {
  try {
    let query1 = '';
    switch (queryType) {
      case 'CHECK_IF_USER_EXISTS':
        query1 = `SELECT user_id FROM users WHERE user_email = '${params.email}';`;
        break;
      case 'UPDATE_USER_OTP':
        query1 = `UPDATE users SET otpHash = '${params.userHash}' WHERE user_id = ${params.userId};`;
        break;
      case 'UPDATE_USER_PASSWORD':
        query1 = `UPDATE users SET user_password = '${params.userPassword}' WHERE user_id = ${params.userId};`;
        break;
      case 'VERIFY_USER_PASSWORD':
        query1 = `SELECT user_id FROM users WHERE user_id = ${params.userId} AND user_password = '${params.userPassword}';`;
        break;
      case 'GET_USER_OTP_DETAILS':
        query1 = `SELECT user_id, otpHash FROM users WHERE user_email = '${params.email}';`;
        break;
      case 'CLEAR_USER_OTP':
        query1 = `UPDATE users SET otpHash = NULL WHERE user_id = '${params.userId}';`;
        break;
    }

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query(query1, Object.values(params), (err, results) => {
          connection.release();
          if (err) {
            logger.error(`forgot password dao ${queryType}`, err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  } catch (err) {
    logger.error('forgot password dao', err);
  }
};

module.exports = {
  loginQuery,
  forgotPasswordQuery,
};
