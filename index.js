const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { default: helmet } = require('helmet');
const bodyParser = require('body-parser');

const { logger } = require('./utils/logger');
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

app.use((req, res, next) => {
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
  )
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
});

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
