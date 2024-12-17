const { connectDB } = require('../config/database');
const { logger } = require('../utils/logger');

var pool = connectDB();

const projectQuery = async (queryType, params = {}) => {
  try {
    let query1 = '';
    switch (queryType) {
      case 'GET_PROJECTS':
        query1 = ``;
        break;
      case 'CREATE_PROJECT':
        query1 = `INSERT INTO projects (
                      project_name, 
                      project_no, 
                      project_description, 
                      regulatory_standard, 
                      invite_members, 
                      documents, 
                      org_id, 
                      org_name, 
                      created_by_id, 
                      created_by_name, 
                      sector_id, 
                      sector_name, 
                      industry_id, 
                      industry_name, 
                      status, 
                      no_of_runs, 
                      success_count, 
                      fail_count, 
                      last_run, 
                      mapping_standards, 
                      summary_report
                  ) 
                  VALUES (
                      '${params.project_name}',
                      '${params.project_no}',
                      '${params.project_description}',
                      '${JSON.stringify(params.regulatory_standard)}',
                      '${JSON.stringify(params.invite_members)}',
                      '${JSON.stringify(params.documents)}',
                      ${params.org_id},
                      '${params.org_name}',
                      ${params.created_by_id},
                      '${params.created_by_name}',
                      ${params.sector_id},
                      '${params.sector_name}',
                      ${params.industry_id},
                      '${params.industry_name}',
                      '${params.status}',
                      ${params.no_of_runs},
                      ${params.success_count},
                      ${params.fail_count},
                      '${params.last_run}',
                      '${params.mapping_standards}',
                      '${JSON.stringify(params.summary_report)}'
        );`;
        break;
      case 'UPDATE_PROJECT':
        query1 = ``;
        break;
      case 'DELETE_PROJECT':
        query1 = ``;
        break;
    }

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query(query1, Object.values(params), (err, results) => {
          connection.release();
          if (err) {
            logger.error(`project dao ${queryType}`, err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  } catch (err) {
    logger.error('project dao', err);
  }
};

module.exports = {
  projectQuery,
};
