const { logger } = require('../utils/logger');
// const { chatQuery } = require('../dao/chat_dao');

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL;

const chatQuestionService = async (params) => {
  try {
    // console.log(
    //   'Request URL:',
    //   `${PYTHON_SERVICE_URL}/chat_standard?user_question=${encodeURIComponent(params.user_question)}`,
    // );

    const response = await fetch(
      `${PYTHON_SERVICE_URL}/chat_standard?user_question=${encodeURIComponent(params.user_question)}`,
    );

    if (response.ok) {
      const responseData = await response.json();
      return { success: true, data: responseData };
    } else {
      // Handle non-OK responses
      console.error(
        'Error: Non-OK response received',
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.status}`,
      };
    }
  } catch (error) {
    // Log the error and return a consistent structure
    console.error('Chat question service error:', error);
    return { success: false, error: 'An error occurred while fetching data' };
  }
};

const uploadStandardChatService = async (params) => {
  try {
    const files = Object.values(params);

    const response = await fetch(
      `${PYTHON_SERVICE_URL}/uploadstd_checklist_crt/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { 'form-data': { files } },
      },
    );
    console.log('response: ' + JSON.stringify(response));

    // if (response.ok) {
    //   const responseData = await response.json();
    //   return { response: true, data: responseData };
    // }
    return response;
  } catch (error) {
    logger.error('chat upload  service', error);
  }
};

const uploadStandardCheckListService = async (params) => {
  try {
    // Make the POST request
    const response = await fetch(
      `${PYTHON_SERVICE_URL}/uploadstd_checklist_crt/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { 'form-data': { params } }, // Use formData as the body
      },
    );

    console.log('Response:', response);

    // Handle successful responses
    if (response.ok) {
      const responseData = await response.json();
      return { success: true, data: responseData };
    }

    // Handle non-OK responses
    console.error('Non-OK response:', response.status, response.statusText);
    return {
      success: false,
      error: `Server returned status ${response.status}`,
    };
  } catch (error) {
    // Handle errors and log them
    console.error('Upload service error:', error);
    return { success: false, error: 'An error occurred while uploading files' };
  }
};

module.exports = {
  uploadStandardChatService,
  chatQuestionService,
  uploadStandardCheckListService,
};
