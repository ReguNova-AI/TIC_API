const {
  STATUS_CODE_SUCCESS,
  STATUS_CODE_BAD_REQUEST,
  MESSAGE_BAD_REQUEST,
  SUCCESS,
  BAD_REQUEST,
  CUSTOM_RESPONSE,
} = require('../constants/response_constants');

const setResponse = (type, message, data = {}, customResponse = {}) => {
  let response = {};
  switch (type) {
    case SUCCESS:
      response.status = true;
      response.message = message;
      response.statusCode = STATUS_CODE_SUCCESS;
      response.messageCode = STATUS_CODE_SUCCESS;
      break;
    case BAD_REQUEST:
      response.status = false;
      response.message = MESSAGE_BAD_REQUEST;
      response.statusCode = STATUS_CODE_BAD_REQUEST;
      response.messageCode = STATUS_CODE_BAD_REQUEST;
      break;
    case CUSTOM_RESPONSE:
      let { statusCode, message: customMessage = '', messageCode } = customResponse;
      response.status = true;
      response.message = customMessage;
      response.statusCode = statusCode;
      response.messageCode = messageCode;
      break;
    default:
      response.status = false;
      response.message = '';
      response.statusCode = '';
      response.messageCode = '';
  }
  response.data = data;
  return response;
};

module.exports = { setResponse };
