const { logger } = require('../utils/logger');
const { certificate } = require('../dao/certificate_dao');

const getCertificateService = async (params) => {
  try {
    const data = await certificate('GET_CERTIFICATES', params);
    return data;
  } catch (error) {
    logger.error('get certificates service', error);
  }
};

const getSingleCertificateService = async (params) => {
  try {
    const data = await certificate('GET_SINGLE_CERTIFICATE', params);
    return data;
  } catch (error) {
    logger.error('get single certificate service', error);
  }
};

const insertCertificateService = async (params) => {
  try {
    let data = {};
    const res = await certificate('CREATE_CERTIFICATE', params);
    let certificate_id = res?.insertId ? res.insertId : 0;
    if (certificate_id) {
      data = await certificate('GET_SINGLE_CERTIFICATE', { certificate_id });
    }
    return data;
  } catch (error) {
    logger.error('insert certificate service', error);
  }
};

module.exports = {
  getCertificateService,
  getSingleCertificateService,
  insertCertificateService,
};
