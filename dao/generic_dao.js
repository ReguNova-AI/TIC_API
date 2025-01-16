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
      case 'GET_ORG_PROJECT_COUNTS':
        query1 = `SELECT count(project_id) as count FROM projects;`;
        break;
      case 'GET_SINGLE_ORGANIZATIONS':
        query1 = `SELECT * FROM organizations WHERE org_id = ${params.org_id};`;
        break;
      case 'CREATE_ORGANISATION':
        query1 = `INSERT INTO organizations (
                      sector_id,
                      sector_name,
                      industries,
                      industry_names,
                      org_name,
                      org_email,
                      org_logo,
                      org_url,
                      org_address,
                      contact_json
                  ) VALUES (
                      ${params.sector_id},
                      '${params.sector_name}',
                      '${params.industries}',
                      '${params.industry_names}',
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
      case 'CREATE_INDUSTRY':
        query1 = `INSERT INTO industries (
                      industry_name, 
                      industry_description, 
                      sector_id,
                      sector_name
                  ) 
                  VALUES (
                      '${params.industry_name}', 
                      '${params.industry_description}', 
                      ${params.sector_id},
                      '${params.sector_name}'
                  );
                `;
        break;
      case 'GET_SECTORS':
        query1 = `SELECT * FROM sectors;`;
        break;
      case 'GET_SINGLE_SECTOR':
        query1 = `SELECT * FROM sectors WHERE sector_id = ${params.sector_id};`;
        break;
      case 'CREATE_SECTOR':
        query1 = `INSERT INTO sectors (
                      sector_name, 
                      sector_desc
                  ) 
                  VALUES (
                      '${params.sector_name}', 
                      '${params.sector_desc}'
                  );`;
        break;
      case 'CHECK_IF_ORG_DETAILS_EXIST':
        query1 = `SELECT org_id FROM organizations WHERE org_name = '${params.org_name}' AND org_email = '${params.org_email}';`;
        break;
      case 'GET_ROLE_ID_BY_NAME':
        query1 = `SELECT role_id FROM roles WHERE role_name = '${params.role_name}'`;
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
