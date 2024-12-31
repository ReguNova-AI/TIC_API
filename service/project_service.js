const { logger } = require('../utils/logger');
const { projectQuery } = require('../dao/project_dao');

// const {} = require('../constants/response_constants');
const projectService = async (params) => {
  try {
    let data = {};
    const response = await projectQuery('CREATE_PROJECT', params);
    let project_id = response?.insertId ? response.insertId : 0;
    if (project_id) {
      data = await projectQuery('GET_SINGLE_PROJECT', { project_id });
    }
    return data;
  } catch (error) {
    logger.error('Project service', error);
  }
};

const getProjectService = async (params) => {
  try {
    const data = await projectQuery('GET_PROJECTS', params);
    return data;
  } catch (error) {
    logger.error('Project service', error);
  }
};

const getSingleProjectService = async (params) => {
  try {
    const data = await projectQuery('GET_SINGLE_PROJECT', params);
    return data;
  } catch (error) {
    logger.error('Get Single project service', error);
  }
};

const projectUpdateService = async (params) => {
  try {
    let data = {};
    await projectQuery('UPDATE_PROJECT', params);
    let project_id = params.project_id;
    if (project_id) {
      data = await projectQuery('GET_SINGLE_PROJECT', { project_id });
    }
    return data;
  } catch (error) {
    logger.error('Project update service', error);
  }
};

const getProjectCountService = async (params) => {
  try {
    const data = await projectQuery('GET_PROJECT_COUNTS', params);
    return data;
  } catch (error) {
    logger.error('Get project count service', error);
  }
};

module.exports = {
  projectService,
  getProjectService,
  getSingleProjectService,
  projectUpdateService,
  getProjectCountService,
};
