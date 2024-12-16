// Package dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { default: helmet } = require('helmet');
const bodyParser = require('body-parser');

// Other dependencies
const { logger } = require('./utils/logger');
const { authenticate } = require('./config/authenticate');

// Routes of the application
const Login = require('./routes/login');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
);
app.use(cors());
app.use(helmet());
app.use(Login);

app.use(async (req, res, next) => {
  const {
    body: { email = 'NA' },
  } = req;
  const start = new Date();
  logger.info(
    `Start Time: ${start.toISOString()} Path: ${req.url} User: ${email}`,
  );
  const { path = '', headers: { authorization = null } = {} } = req;
  if (
    path === '/api/v1/login' ||
    path === '/api/v1/forgotPassword/sendOtp' ||
    path === '/api/v1/forgotPassword/verifyOtp' ||
    path === '/api/v1/resetPassword' ||
    path === '/api/v1/refreshToken' ||
    path === '/api/v1/logout'
  ) {
    res.on('finish', function () {
      const end = new Date();
      const timeTaken = `${end - start}ms`;
      logger.info(
        `End Time: ${end.toISOString()} Path: ${req.url} Time Taken: ${timeTaken} Response Status: ${
          this.statusCode
        } User: ${email}`,
      );
    });
    next();
  } else if (authorization) {
    const {
      isValid = false,
      isExpired = false,
      details = {},
    } = await authenticate(authorization);
    if (isExpired) {
      res.status(401).send({ error: 'Token Expired' });
    } else if (isValid) {
      req.body.userDetails = details;
      res.on('finish', function () {
        const endTime = new Date();
        const totalTime = endTime - startTime + 'ms';
        logger.info(
          `End Time: ${endTime.toISOString()}, Path: ${req.url}, Time Taken: ${totalTime}, Response Status: ${
            this.statusCode
          }`,
        );
      });
      next();
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
