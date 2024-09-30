import * as winston from 'winston';
import * as path from 'path';

// custom winstons format
const winstons = winston.format.printf(({
    timestamp,
    level,
    message,
    context,
    trace,
    ip,
    statusCode,
    duration,
    userAgent,
    errorMessage,
    err,
    action,
    args,
    model
}) => {
    return JSON.stringify({
        timestamp,
        message,
        level,
        statusCode,
        context,
        errorMessage,
        trace: trace || null,
        userAgent,
        duration,
        err,
        ip: ip || 'N/A',
        args,
        action,
        model
    })
});

export const createLogger = (logFilename: string) => {

    const transports = [
        // Console transport
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.json(),
                winston.format.simple(),
                winstons
            ),
        }),

        // Write logs to the specified log file
        new winston.transports.File({
            filename: path.join('log', logFilename),
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
                winstons
            ),
        }),
    ];

    return winston.createLogger({
        format: winston.format.json(),
        transports,
    });
};
