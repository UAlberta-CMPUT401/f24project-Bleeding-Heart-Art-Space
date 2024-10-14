import winston from 'winston';
import { LOG_LEVEL } from '@config/env';

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  level: LOG_LEVEL || 'warn',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ],
});

export { logger };
