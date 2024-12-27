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
      case 'CREATE_ORGANISATION':
        query1 = `INSERT INTO organizations (
                      sector_id,
                      industries,
                      org_name,
                      org_email,
                      org_logo,
                      org_url,
                      org_address,
                      contact_json
                  ) VALUES (
                      ${params.sector_id},
                      '${params.industries}',
                      '${params.org_name}',
                      '${params.org_email}',
                      '${params.org_logo}',
                      '${params.org_url}',
                      '${JSON.stringify(params.org_address)}',
                      '${JSON.stringify(params.contact_json)}'
                  );
                `;
        break;
      case 'GET_INDUSTRIES':
        query1 = `SELECT * FROM industries;`;
        break;
      case 'GET_SINGLE_INDUSTRY':
        query1 = `SELECT * FROM industries WHERE industry_id = ${params.industry_id};`;
        break;
      case 'GET_SECTORS':
        query1 = `SELECT * FROM sectors;`;
        break;
      case 'GET_SINGLE_SECTOR':
        query1 = `SELECT * FROM sectors WHERE sector_id = ${params.sector_id};`;
        break;
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
