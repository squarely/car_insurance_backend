import fs from 'fs';
import dotenv from "dotenv";
dotenv.config()

const errorHandler = (err, req, res, next) => {

    switch (err.name) {
        case 'MongoServerError':
            err.statusCode = 400
            break;
        case 'ValidationError':
            err.statusCode = 400
        case 'UnauthorizedError':
            err.statusCode = 401
        default:
            break;
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const stack = process.env.NODE_ENV === 'production' ? null : err.stack;

    const errorLog = `${new Date().toISOString()} - ${message}\n${stack}\n\n`;
    fs.appendFileSync('./Logs/error.log', errorLog);

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        stack,
    });
};

export default errorHandler;
