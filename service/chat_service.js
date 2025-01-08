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

// const uploadStandardChatService = async (params) => {
//   try {
//     const files = Object.values(params);

//     const response = await fetch(`${PYTHON_SERVICE_URL}/uploadstd_chat/`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       // body: { 'form-data': { file: files[0] } },
//       body
//     });
//     console.log('response: ' + JSON.stringify(response));

//     if (response.ok) {
//       const responseData = await response.json();
//       return { response: true, data: responseData };
//     }
//     return response;
//   } catch (error) {
//     logger.error('chat upload  service', error);
//   }
// };

const uploadStandardChatService = async (params) => {
  try {
    const formData = new FormData();

    // Assuming 'params' contains the file(s) you want to upload
    const files = Object.values(params);
    formData.append('file', files[0]); // Add the first file to FormData

    const response = await fetch(`${PYTHON_SERVICE_URL}/uploadstd_chat/`, {
      method: 'POST',
      body: formData, // Set the formData as the request body
      redirect: 'follow',
    });

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
    console.error('Chat upload service error', error);
    logger.error('Chat upload service error', error);
    return { response: false, error };
  }
};

const uploadStandardCheckListService = async (params) => {
  try {
    const formData = new FormData();

    // Assuming 'params' contains the file(s) you want to upload
    const files = Object.values(params);
    formData.append('file', files);
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
    // Handle errors and log them
    console.error('Upload service error:', error);
    return { success: false, error: 'An error occurred while uploading files' };
  }
};

const uploadProjectDocsService = async (params) => {
  try {
    const files = Object.values(params);

    const response = await fetch(
      `${PYTHON_SERVICE_URL}/upload_project_docs_summarize/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { 'form-data': { files } },
      },
    );
    console.log('response: ' + JSON.stringify(response));

    
    if (response.ok) {
      const responseData = await response.json();
      return { success: true, data: responseData };
    } else {
      // Handle non-OK responses
      logger.error(
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
    logger.error('chat upload  service', error);
  }
};

const chatDataService = async () => {
  try {
    const response = await fetch(`${PYTHON_SERVICE_URL}/api/data`, {
      method: 'GET',
    });
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
    logger.error('Chat data service error', error);
    return { response: false, error };
  }
};

module.exports = {
  uploadStandardChatService,
  chatQuestionService,
  uploadStandardCheckListService,
  uploadProjectDocsService,
  chatDataService,
};
