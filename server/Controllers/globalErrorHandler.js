"use strict";

const CustomError = require(`${__dirname}/../Utils/CustomError`);


const devErrors = (error, res) => {
    return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stacktrace: error.stack,
        error
    });
}

const prodErrors = (error, res) => {

    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    } else {
        return res.status(500).json({
            status: "error",
            message: `Something went wrong. It's not your fault!`
        });
    }
}

const validationErrorHandler = (error) => {
    const errorMessages = Object.values(error.errors).map(val => val.message).join(' ');

    const msg = `Invalid input: ${errorMessages}`;

    return new CustomError(msg, 400);
}

const JsonWebTokenErrorHandler = (error) => {
    return new CustomError(error.message, 400);
}

module.exports = (error, req, res, next) => {
    error.message = error.message || "Something went wrong. Please try again.";
    error.statusCode = error.statusCode || 500;

    if (process.env.NODE_ENV === "development") {
        devErrors(error, res);
    } else if (process.env.NODE_ENV === "production") {
        if (error.code === 11000) error = new CustomError("Account already exist.", 400);
        if (error.name === "ValidationError") error = validationErrorHandler(error);
        if (error.name === "JsonWebTokenError") error = JsonWebTokenErrorHandler(error);
        prodErrors(error, res);
    }
}
