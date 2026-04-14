import winston from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

const logtail = new Logtail(process.env.LOGTAIL_TOKEN!, {
  endpoint: process.env.LOGTAIL_URL,
});

const customLevels = {
  levels: {
    alert: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
};

const baseLogger = winston.createLogger({
  levels: customLevels.levels,
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(({ level, message, timestamp, ...rest }) => {
      const meta = Object.keys(rest).length ? JSON.stringify(rest) : '';
      return `[${timestamp}] ${level.toUpperCase()}: ${message} ${meta}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new LogtailTransport(logtail),
  ],
});

/** Normaliza o 2º argumento (objeto, Error ou valor vindo de catch) para o Winston. */
function toLogMeta(meta?: unknown): Record<string, unknown> {
  if (meta === undefined || meta === null) {
    return {};
  }
  if (meta instanceof Error) {
    return {
      message: meta.message,
      ...(meta.stack !== undefined ? {stack: meta.stack} : {}),
    };
  }
  if (typeof meta === 'object' && !Array.isArray(meta)) {
    return meta as Record<string, unknown>;
  }
  return {value: meta};
}

export const logger = {
  info: (msg: string, meta?: unknown) => baseLogger.info(msg, toLogMeta(meta)),
  warn: (msg: string, meta?: unknown) => baseLogger.warn(msg, toLogMeta(meta)),
  error: (msg: string, meta?: unknown) => baseLogger.error(msg, toLogMeta(meta)),
  debug: (msg: string, meta?: unknown) => baseLogger.debug(msg, toLogMeta(meta)),
  alert: (msg: string, meta?: unknown) =>
    baseLogger.log('alert', msg, toLogMeta(meta)),
};