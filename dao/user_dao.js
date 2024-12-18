const { connectDB } = require('../config/database');
const { logger } = require('../utils/logger');

var pool = connectDB();

const userQuery = async (queryType, params = {}) => {
  try {
    let query1 = '';
    switch (queryType) {
      case 'GET_USERS':
        query1 = `SELECT * FROM users;`;
        break;
      case 'GET_SINGLE_USER':
        query1 = `SELECT * FROM users WHERE user_id = ${params.user_id};`;
        break;
      case 'CREATE_USER':
        query1 = `INSERT INTO users (
                      org_id, 
                      role_id, 
                      user_first_name, 
                      user_last_name, 
                      user_profile, 
                      user_email, 
                      user_phone_no, 
                      user_password, 
                      user_address, 
                      created_by, 
                      sector_id, 
                      sector_name, 
                      org_name, 
                      industry_id, 
                      industry_name
                  ) VALUES (
                      ${params.org_id},
                      ${params.role_id},
                      '${params.user_first_name}',
                      '${params.user_last_name}',
                      '${params.user_profile}',
                      '${params.user_email}',
                      '${params.user_phone_no}',
                      '${params.user_password}',
                      '${JSON.stringify(params.user_address)}',
                      ${params.created_by},
                      ${params.sector_id},
                      '${params.sector_name}',
                      '${params.org_name}',
                      ${params.industry_id},
                      '${params.industry_name}'
                  );`;
        break;
      case 'UPDATE_USER':
        query1 = ``;
        break;
      case 'DELETE_USER':
        query1 = ``;
        break;
    }

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query(query1, Object.values(params), (err, results) => {
          connection.release();
          if (err) {
            logger.error(`User dao ${queryType}`, err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  } catch (err) {
    logger.error('User dao', err);
  }
};

module.exports = {
  userQuery,
};
