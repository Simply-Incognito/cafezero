"use strict";

const jwt = require('jsonwebtoken');

const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);
const CustomError = require(`${__dirname}/../Utils/CustomError`);

const User = require(`${__dirname}/../Models/userModel`);


module.exports = asyncErrorHandler(async (req, res, next) => {
    // Check if token exist

    var testToken = req.headers.authorization;

    var token;

    if (testToken && testToken.startsWith("bearer")) {
        token = testToken.split(' ')[1];
    }

    //console.log(token);

    if (!token) {
        const error = new CustomError("You are not logged in!", 401);
        return next(error);
    }


    // Check if token is valid

    const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);

    //console.log(decodedToken);

    // Fetch User from DB
    const user = await User.findById(decodedToken.id);

    //console.log(user);

    if (!user) {
        const error = new CustomError("User does not exist!", 404);
        return next(error);
    }

    // Check if user has changed his password after token is issued
    const isPasswordModified = await user.isPasswordModified(decodedToken.iat);

    if (isPasswordModified) {
        const error = new CustomError("Password changed recently. Please login again!", 401);
        return next(error);
    }

    // Allow user to access the route
    req.user = user;
    next(); // Call next middleware
});


