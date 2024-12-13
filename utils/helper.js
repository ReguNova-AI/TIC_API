const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// const PASSWORD = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

// const validate = (strArrObj = {}, emails = {}, numbers = {}, passwords = {}) => {
//   let validArray = [];
//   Object.values(strArrObj).map((item) => {
//     validArray.push(!_.isEmpty(item));
//   });
//   Object.values(emails).map((item) => {
//     validArray.push(validator.isEmail(item));
//   });
//   Object.values(numbers).map((item) => {
//     validArray.push(item > 0);
//   });
//   Object.values(passwords).map((item) => {
//     validArray.push(item.match(PASSWORD));
//   });

//   return validArray.every(Boolean);
// };

const getOtp = () => {
  const number = Math.random().toString().slice(2, 8);
  return number;
};

const getToken = (data) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let token = jwt.sign(data, jwtSecretKey, { expiresIn: '1d' });
  return token;
};

const getRefreshToken = (data) => {
  let jwtRefreshSecretKey = process.env.JWT_SECRET_KEY;
  let token = jwt.sign(data, jwtRefreshSecretKey, { expiresIn: '7d' });
  return token;
};

const smtpTransporter = nodemailer.createTransport({
  port: process.env.SMTP_PORT,
  host: process.env.SMTP_HOST,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  debug: true,
});

module.exports = {
  // validate,
  getOtp,
  getToken,
  getRefreshToken,
};
