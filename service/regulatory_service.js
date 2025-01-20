const { logger } = require('../utils/logger');
const { regulatoryQuery } = require('../dao/regulatory_dao');

const getRegulatoryService = async () => {
  try {
    const data = await regulatoryQuery('GET_REGULATORIES');
    return data;
  } catch (error) {
    logger.error('get regulatory service', error);
  }
};

const createRegulatoryService = async (params) => {
  try {
    let data = {};
    const response = await regulatoryQuery('CREATE_REGULATORY', params);
    let standard_id = response?.insertId ? response.insertId : 0;
    if (standard_id) {
      data = await regulatoryQuery('GET_SINGLE_REGULATORY', {
        standard_id,
      });
    }
    return data;
  } catch (error) {
    logger.error('create organization service', error);
  }
};

module.exports = {
  getRegulatoryService,
  createRegulatoryService,
};
