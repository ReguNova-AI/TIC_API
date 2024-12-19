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

const getIndustryService = async (params) => {
  try {
    const data = await genericQuery('GET_INDUSTRIES', params);
    return data;
  } catch (error) {
    logger.error('get industries service', error);
  }
};

const getSingleIndustryService = async (params) => {
  try {
    const data = await genericQuery('GET_SINGLE_INDUSTRY', params);
    return data;
  } catch (error) {
    logger.error('get single industry service', error);
  }
};

module.exports = {
  getOrgService,
  getSignleOrgService,
  getIndustryService,
  getSingleIndustryService,
};
