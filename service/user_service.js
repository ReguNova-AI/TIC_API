const { logger } = require('../utils/logger');
const { userQuery } = require('../dao/user_dao');

// const {} = require('../constants/response_constants');
const insertUserService = async (params) => {
  try {
    let data = {};
    const res = await userQuery('CREATE_USER', params);
    let user_id = res?.insertId ? res.insertId : 0;
    if (user_id) {
      data = await userQuery('GET_SINGLE_USER', { user_id });
    }
    return data;
  } catch (error) {
    logger.error('insert user service', error);
  }
};

const getUserService = async (params) => {
  try {
    const data = await userQuery('GET_USERS', params);
    return data;
  } catch (error) {
    logger.error('get user service', error);
  }
};

const getSignleUserService = async (params) => {
  try {
    const data = await userQuery('GET_SINGLE_USER', params);
    return data;
  } catch (error) {
    logger.error('get single user service', error);
  }
};

module.exports = {
  insertUserService,
  getUserService,
  getSignleUserService,
};
