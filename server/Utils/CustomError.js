"use strict";

module.exports = class CustomError extends Error {
    constructor(errorMessage, statusCode) {
        super(errorMessage);

        this.statusCode = statusCode;
        this.status = (statusCode >= 400 && statusCode < 500) ? 'fail' : 'Internal Server Error';

        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}