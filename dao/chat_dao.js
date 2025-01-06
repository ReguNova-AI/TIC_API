const { connectDB } = require('../config/database');
const { logger } = require('../utils/logger');

var pool = connectDB();

const chatQuery = async (queryType, params = {}) => {
  try {
    let query1 = '';
    switch (queryType) {
      case '':
        query1 = ``;
        break;
    }

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query(query1, Object.values(params), (err, results) => {
          connection.release();
          if (err) {
            logger.error(`chat dao ${queryType}`, err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  } catch (err) {
    logger.error('chat dao', err);
  }
};

module.exports = {
  chatQuery,
};
