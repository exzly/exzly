const moment = require('moment');
const winston = require('winston');
require('winston-daily-rotate-file');

const winstonLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  exitOnError: false,
  handleExceptions: true,
  handleRejections: true,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, message, stack }) => {
      return `[${moment(timestamp).format('DD-MM-YYYY HH:mm:ss')}]: ${stack || message}`;
    }),
  ),
  transports: [
    new winston.transports.Console({
      level: 'debug',
      silent: process.env.NODE_ENV === 'production',
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      maxSize: '20m',
      filename: 'logs/error/%DATE%.log',
      maxFiles: null,
      datePattern: 'YYYY.MM.DD',
      zippedArchive: true,
    }),
  ],
});

module.exports = { winstonLogger };
