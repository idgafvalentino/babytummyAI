const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const config = require('../config/app.config');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create rotating transport for error logs
const errorRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(config.paths.logs, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '14d',
  format: logFormat,
});

// Create rotating transport for combined logs
const combinedRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(config.paths.logs, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: logFormat,
});

// Create console transport for development
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
});

// Create the logger
const logger = winston.createLogger({
  level: config.logging.level || 'info',
  format: logFormat,
  transports: [
    errorRotateTransport,
    combinedRotateTransport,
    ...(config.app.env !== 'production' ? [consoleTransport] : []),
  ],
});

// Handle rotation events
errorRotateTransport.on('rotate', function (oldFilename, newFilename) {
  logger.info(`Rotated error logs from ${oldFilename} to ${newFilename}`);
});

combinedRotateTransport.on('rotate', function (oldFilename, newFilename) {
  logger.info(`Rotated combined logs from ${oldFilename} to ${newFilename}`);
});

// Create utility methods
const loggerUtil = {
  info: (message, meta = {}) => {
    logger.info(message, { ...meta, timestamp: new Date().toISOString() });
  },

  error: (message, error = null, meta = {}) => {
    logger.error(message, {
      ...meta,
      error: error ? error.stack : null,
      timestamp: new Date().toISOString(),
    });
  },

  warn: (message, meta = {}) => {
    logger.warn(message, { ...meta, timestamp: new Date().toISOString() });
  },

  debug: (message, meta = {}) => {
    logger.debug(message, { ...meta, timestamp: new Date().toISOString() });
  },

  // Log HTTP requests
  httpLogger: (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info('HTTP Request', {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
      });
    });
    next();
  },
};

module.exports = loggerUtil;
