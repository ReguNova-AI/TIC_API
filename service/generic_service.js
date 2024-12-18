const { logger } = require('../utils/logger');
const { genericQuery } = require('../dao/generic_dao');

const getOrgService = async (params) => {
  try {
    const data = await genericQuery('GET_ORGANIZATIONS', params);
    return data;
  } catch (error) {
    logger.error('get organization service', error);
  }
};

const getSignleOrgService = async (params) => {
  try {
    const data = await genericQuery('GET_SINGLE_ORGANIZATIONS', params);
    return data;
  } catch (error) {
    logger.error('get single organization service', error);
  }
};

module.exports = {
  getOrgService,
  getSignleOrgService,
};
