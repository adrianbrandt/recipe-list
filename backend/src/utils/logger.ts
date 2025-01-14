import { createLogger, format, transports } from 'winston';
import path from 'path';
import {existsSync, mkdirSync} from 'node:fs';

const logDirectory = path.join(__dirname, '../logs');

if (!existsSync(logDirectory)) {
    mkdirSync(logDirectory, { recursive: true });
}

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
        format.prettyPrint()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
        }),
        new transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' }),
        //new transports.File({ filename: path.join(logDirectory, 'combined.log') }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new transports.Console({
            format: format.simple(),
        }),
    );
}

export default logger;
