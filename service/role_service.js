const { logger } = require('../utils/logger');
const { roleQuery } = require('../dao/role_dao');

const getRoleService = async (params) => {
  try {
    const data = await roleQuery('GET_ROLES', params);
    return data;
  } catch (error) {
    logger.error('get organization service', error);
  }
};

const getSingleRoleService = async (params) => {
  try {
    const data = await roleQuery('GET_SINGLE_ROLE', params);
    return data;
  } catch (error) {
    logger.error('get single organization service', error);
  }
};

module.exports = {
  getRoleService,
  getSingleRoleService,
};
