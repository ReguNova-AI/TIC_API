const { logger } = require('../utils/logger');
const { genericQuery } = require('../dao/generic_dao');
const { insertUserService } = require('../service/user_service');
const { loginQuery } = require('../dao/login_dao');

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
    const [{ user_id = null } = {}] = await loginQuery('CHECK_IF_USER_EXISTS', {
      email: params.contact_json.primary_contact.email,
    });
    if (!user_id > 0) {
      const response = await genericQuery('CREATE_ORGANISATION', params);
      let org_id = response?.insertId ? response.insertId : 0;
      const role_name = 'Org Super Admin';
      if (org_id > 0) {
        const [{ role_id = null } = {}] = await genericQuery(
          'GET_ROLE_ID_BY_NAME',
          { role_name },
        );
        let userParams = {
          org_id,
          org_name: params.org_name,
          sector_id: params.sector_id,
          sector_name: params.sector_name,
          user_first_name: params.contact_json.primary_contact.first_name,
          user_last_name: params.contact_json.primary_contact.last_name,
          user_email: params.contact_json.primary_contact.email,
          user_phone_no: params.contact_json.primary_contact.phone,
          industry_id: params.industries[0],
          industry_name: params.industry_names[0],
          user_address: null,
          user_profile: null,
          role_id,
          role_name,
          created_by: params.user_id,
        };

        const res = await insertUserService(userParams);
        if (res.insertId != null) {
          data = await genericQuery('GET_SINGLE_ORGANIZATIONS', { org_id });
        }
      }
    } else {
      return {
        message: 'Primary contact email is already in use',
        is_primary_contact_exist: true,
      };
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

const createSectorService = async (params) => {
  try {
    let data = {};
    const response = await genericQuery('CREATE_SECTOR', params);
    let sector_id = response?.insertId ? response.insertId : 0;
    if (sector_id) {
      data = await genericQuery('GET_SINGLE_SECTOR', { sector_id });
    }
    return data;
  } catch (error) {
    logger.error('create sector service', error);
  }
};

const getOrgDetailsExistService = async (params) => {
  try {
    const [{ org_id = null } = {}] = await genericQuery(
      'CHECK_IF_ORG_DETAILS_EXIST',
      params,
    );
    return org_id;
  } catch (error) {
    logger.error('get org details exist service', error);
  }
};

const getOrgCountService = async (params) => {
  try {
    const data = await genericQuery('GET_ORG_PROJECT_COUNTS', params);
    return data;
  } catch (error) {
    logger.error('Get org project count service', error);
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
  createSectorService,
  getOrgDetailsExistService,
  getOrgCountService,
};
