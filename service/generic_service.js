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

const createOrgService = async (params) => {
  try {
    let data = {};
    const response = await genericQuery('CREATE_ORGANISATION', params);
    let org_id = response?.insertId ? response.insertId : 0;
    if (org_id) {
      data = await genericQuery('GET_SINGLE_ORGANIZATIONS', { org_id });
    }
    return data;
  } catch (error) {
    logger.error('create org service', error);
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

const createIndustryService = async (params) => {
  try {
    let data = {};
    const response = await genericQuery('CREATE_INDUSTRY', params);
    let industry_id = response?.insertId ? response.insertId : 0;
    if (industry_id) {
      data = await genericQuery('GET_SINGLE_INDUSTRY', { industry_id });
    }
    return data;
  } catch (error) {
    logger.error('create industry service', error);
  }
};

const getSectorsService = async (params) => {
  try {
    const data = await genericQuery('GET_SECTORS', params);
    return data;
  } catch (error) {
    logger.error('get sectors service', error);
  }
};

const getSingleSectorService = async (params) => {
  try {
    const data = await genericQuery('GET_SINGLE_SECTOR', params);
    return data;
  } catch (error) {
    logger.error('get single sector service', error);
  }
};

module.exports = {
  getOrgService,
  getSignleOrgService,
  createOrgService,
  getIndustryService,
  getSingleIndustryService,
  createIndustryService,
  getSectorsService,
  getSingleSectorService,
};
