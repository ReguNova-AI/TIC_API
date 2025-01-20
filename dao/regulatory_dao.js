const { connectDB } = require('../config/database');
const { logger } = require('../utils/logger');

var pool = connectDB();

const regulatoryQuery = async (queryType, params = {}) => {
  try {
    let query1 = '';
    switch (queryType) {
      case 'GET_REGULATORIES':
        query1 = `SELECT * FROM regulatory_standard;`;
        break;
      case 'CREATE_REGULATORY':
        query1 = `INSERT INTO regulatory_standard (industry_id, industry_name, standard_name, standard_url) VALUES ('${params.industry_id}', '${params.industry_name}', '${params.standard_name}', '${params.standard_url}');`;
        break;
      case 'GET_SINGLE_REGULATORY':
        query1 = `SELECT * FROM regulatory_standard WHERE standard_id = ${params.standard_id};`;
        break;
    }

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query(query1, Object.values(params), (err, results) => {
          connection.release();
          if (err) {
            logger.error(`regulatory dao ${queryType}`, err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  } catch (err) {
    logger.error('regulatory dao', err);
  }
};

module.exports = {
  regulatoryQuery,
};
