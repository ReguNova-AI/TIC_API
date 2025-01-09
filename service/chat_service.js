const { logger } = require('../utils/logger');
// const { chatQuery } = require('../dao/chat_dao');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

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

const uploadStandardChatService = async () => {
  try {
    const filePath = path.join(__dirname, '../utils/IEC-61400-12-2022.pdf');
    const form = new FormData();

    // Append the PDF file to the form
    const fileStream = fs.createReadStream(filePath);
    if (!fileStream) {
      console.log('fileStream isnot found');
    }

    // Append the PDF file to the form
    form.append('file', fileStream, {
      filename: 'your-file.pdf', // File name sent to the server
      ContentType: 'multipart/form-data; boundary=----boundary123',
      Accept: 'application/json',
    });

    const apiUrl = `${PYTHON_SERVICE_URL}/uploadstd_chat/`;

    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(), // Automatically set appropriate headers for multipart/form-data
        // Optional: Include your auth token if needed
        'User-Agent': 'MyCustomUserAgent/1.0', // Add custom User-Agent header
      },
    });

    // Handle successful responses
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      // Handle non-OK responses
      console.error(
        'Error: Non-OK response received',
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.statusText}`,
      };
    }
  } catch (error) {
    logger.error('Chat upload service error', error);
    return { response: false, error };
  }
};

const uploadStandardCheckListService = async () => {
  const filePath = path.join(__dirname, '../utils/IEC-61400-12-2022.pdf');

  try {
    const form = new FormData();

    // Append the PDF file to the form
    const fileStream = fs.createReadStream(filePath);
    if (!fileStream) {
      console.log('fileStream isnot found');
    }

    // Append the PDF file to the form
    form.append('file', fileStream, {
      filename: 'your-file.pdf', // File name sent to the server
      ContentType: 'multipart/form-data; boundary=----boundary123',
      Accept: 'application/json',
    });

    // const headers = {
    //   'Content-Type': 'multipart/form-data; boundary=----boundary123',
    //   Accept: 'application/json',
    //   'User-Agent': 'MyCustomUserAgent/1.0',
    //   Connection: 'keep-alive',
    // };

    const apiUrl = `${PYTHON_SERVICE_URL}/uploadstd_checklist_crt/`;

    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(), // Automatically set appropriate headers for multipart/form-data
        // Optional: Include your auth token if needed
        'User-Agent': 'MyCustomUserAgent/1.0', // Add custom User-Agent header
      },
    });

    // Handle successful responses
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      // Handle non-OK responses
      console.error(
        'Error: Non-OK response received',
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.statusText}`,
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
