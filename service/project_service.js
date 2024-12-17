const { logger } = require('../utils/logger');
const { projectQuery } = require('../dao/project_dao');

// const {} = require('../constants/response_constants');
const projectService = async (params) => {
  try {
    const res = await projectQuery('CREATE_PROJECT', params);
    return res;
  } catch (error) {
    logger.error('Project service', error);
  }
};

module.exports = {
  projectService,
};
