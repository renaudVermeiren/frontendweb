// src/core/logging.ts
import config from 'config';
import winston from 'winston';
const { combine, timestamp, colorize, printf } = winston.format;

const NODE_ENV = config.get<string>('env');
const LOG_LEVEL = config.get<string>('log.level');
const LOG_DISABLED = config.get<boolean>('log.disabled');

const loggerFormat = () => {

  const formatMessage = ({
    level,
    message,
    timestamp,
    ...rest
  }: winston.Logform.TransformableInfo) => {
    return `${timestamp} | ${level} | ${message} | ${JSON.stringify(rest)}`;
  };

  const formatError = ({
    error, ...rest
  }: winston.Logform.TransformableInfo) => {
    const {stack} = (error as {stack: string});
    return `${formatMessage(rest)}\n\n${stack}\n`;
  };
  
  // 👇 4
  const format = (info: winston.Logform.TransformableInfo) => {
    // 👇 5
    if (info?.['error'] instanceof Error) {
      return formatError(info);
    }

    return formatMessage(info); // 👈 6
  };

  return combine(colorize(), timestamp(), printf(format));
};

// 👇 7
const rootLogger: winston.Logger = winston.createLogger({
  level: LOG_LEVEL,
  format: loggerFormat(),
  defaultMeta: { env: NODE_ENV },
  transports:
    NODE_ENV === 'testing'
      ? [
        new winston.transports.File({
          filename: 'test.log',
          silent: LOG_DISABLED,
        }),
      ]
      : [new winston.transports.Console({ silent: LOG_DISABLED })],
});

export const getLogger = () => {
  return rootLogger;
};