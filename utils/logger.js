var winston = require('winston');
require('winston-daily-rotate-file');

var transport = new winston.transports.DailyRotateFile({
  filename: 'logs/tic-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '365d',
});

var logger = winston.createLogger({
  transports: [transport],
  format: winston.format.combine(winston.format.simple()),
});

module.exports = { logger };
