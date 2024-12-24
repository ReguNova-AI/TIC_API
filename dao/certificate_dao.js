const { connectDB } = require('../config/database');
const { logger } = require('../utils/logger');

var pool = connectDB();

const certificate = async (queryType, params = {}) => {
  try {
    let query1 = '';
    switch (queryType) {
      case 'GET_CERTIFICATES':
        query1 = `SELECT * FROM certificates WHERE created_by_id = ${params.user_id};`;
        break;
      case 'GET_SINGLE_CERTIFICATE':
        query1 = `SELECT * FROM certificates WHERE certificate_id = ${params.certificate_id};`;
        break;
      case 'CREATE_CERTIFICATE':
        query1 = `INSERT INTO certificates (
                    certificate_name, 
                    certificate_subject, 
                    certificate_status, 
                    issuer, 
                    date_of_issued, 
                    date_of_expiry, 
                    file_url, 
                    file_name, 
                    created_by_id, 
                    created_by_name, 
                    org_id, 
                    org_name, 
                    sector_id, 
                    sector_name, 
                    industry_id, 
                    industry_name
                  ) VALUES (
                    '${params.certificate_name}',
                    '${params.certificate_subject}',
                    '${params.certificate_status}',
                    '${params.issuer}',
                    '${params.date_of_issued}',
                    '${params.date_of_expiry}',
                    '${params.file_url}',
                    '${params.file_name}',
                    ${params.created_by_id},
                    '${params.created_by_name}',
                    ${params.org_id},
                    '${params.org_name}',
                    ${params.sector_id},
                    '${params.sector_name}',
                    ${params.industry_id},
                    '${params.industry_name}'
                  );`;
        break;
    }

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query(query1, Object.values(params), (err, results) => {
          connection.release();
          if (err) {
            logger.error(`certificate dao ${queryType}`, err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  } catch (err) {
    logger.error('certificate dao', err);
  }
};

module.exports = {
  certificate,
};
