const { logger } = require('../utils/logger');
const { userQuery } = require('../dao/user_dao');
const { generateRandomPassword } = require('../utils/helper');
const { loginQuery } = require('../dao/login_dao');

const insertUserService = async (params) => {
  try {
    let data = {};
    params.user_password = generateRandomPassword();

    // const mailOptions = {
    //   from: process.env.FROM,
    //   to: params.user_email.toLowerCase(),
    //   text: params.user_password,
    //   subject: 'Your password for TIC application',
    //   html: `<p>Hello, please enter the below password while you're logging in,</p>
    //         <p><b>${params.user_password}</b></p>
    //         <p>Note: This is an auto-generated email. Please do not reply to it.</p>
    //         <p>Thanks,<br>Team TIC</p>`,
    // };

    // await smtpTransporter.sendMail(mailOptions);
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

const getUserExistService = async (params) => {
  try {
    try {
      const [{ user_id = null } = {}] = await loginQuery(
        'CHECK_IF_USER_EXISTS',
        params,
      );
      return user_id;
    } catch (error) {
      logger.error('get single user service', error);
    }
  } catch (error) {
    logger.error('get user exist service', error);
  }
};

module.exports = {
  insertUserService,
  getUserService,
  getSignleUserService,
  getUserExistService,
};
