const { createLogger, format, transports } = require('winston');
const { config } = require('../config/config');
const { ApplicationEnvironment } = require('../constants');

const isDev = config.ENV !== ApplicationEnvironment.PRODUCTION;

const devFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({ format: 'HH:mm:ss' }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? ` ${JSON.stringify(meta, null, 2)}`
      : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  }),
);

const prodFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json(),
);

const logger = createLogger({
  level: config.LOG_LEVEL || 'info',
  format: isDev ? devFormat : prodFormat,
  transports: [new transports.Console()],
});

logger.stream = {
  write: (message) => logger.http(message.trimEnd()),
};

module.exports = logger;
