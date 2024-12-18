const { connectDB } = require('../config/database');
const { logger } = require('../utils/logger');

var pool = connectDB();

const genericQuery = async (queryType, params = {}) => {
  try {
    let query1 = '';
    switch (queryType) {
      case 'GET_ORGANIZATIONS':
        query1 = `SELECT * FROM organizations;`;
        break;
      case 'GET_SINGLE_ORGANIZATIONS':
        query1 = `SELECT * FROM organizations WHERE org_id = ${params.org_id};`;
        break;
      // case '':
      //   query1 = ``;
      //   break;
      // case '':
      //   query1 = ``;
      //   break;
    }

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query(query1, Object.values(params), (err, results) => {
          connection.release();
          if (err) {
            logger.error(`generic dao ${queryType}`, err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  } catch (err) {
    logger.error('generic dao', err);
  }
};

module.exports = {
  genericQuery,
};
