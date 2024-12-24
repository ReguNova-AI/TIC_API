const { connectDB } = require('../config/database');
const { logger } = require('../utils/logger');

var pool = connectDB();

const roleQuery = async (queryType, params = {}) => {
  try {
    let query1 = '';
    switch (queryType) {
      case 'GET_ROLES':
        query1 = `SELECT * FROM roles;`;
        break;
      case 'GET_SINGLE_ROLE':
        query1 = `SELECT * FROM roles WHERE role_id = ${params.role_id};`;
        break;
    }

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query(query1, Object.values(params), (err, results) => {
          connection.release();
          if (err) {
            logger.error(`role dao ${queryType}`, err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  } catch (err) {
    logger.error('role dao', err);
  }
};

module.exports = {
  roleQuery,
};
