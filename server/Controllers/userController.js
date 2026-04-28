"use strict";

const jwt = require("jsonwebtoken");

const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);

const CustomError = require(`${__dirname}/../Utils/CustomError`);

// Import user model
const User = require(`${__dirname}/../Models/userModel`);

const filterRequestObj = (requestObj, allowedFields) => {
    let newObj = {};

    Object.keys(requestObj).forEach(prop => {
        if (allowedFields.includes(prop)) {
            newObj[prop] = requestObj[prop];
        }
    });

    return newObj;
}

const createToken = (id) => {
    return jwt.sign({ id: id }, process.env.PRIVATE_KEY, { expiresIn: process.env.TOKEN_EXPIRES_IN });
}

// Update Password
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
    // Verify if user exists

    const user = await User.findOne({ email: req.user.email }).select("+password");

    if (!user) {
        const error = new CustomError("Account does not exist", 404);
        return next(error);
    }

    // check inputed user password
    const isMatch = await user.ValidateUserPassword(req.body.currentPassword, user.password);

    if (!isMatch) {
        const error = new CustomError("Incorrect password", 404);
        return next(error);
    }

    // Update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    if (user.password !== req.body.confirmPassword) {
        const error = new CustomError("Passwords do not match!", 400);
        return next(error);
    }

    user.passwordChangedAt = Date.now();

    // Generate Token
    const token = createToken(user._id);

    user.save({ validateBeforeSave: true });

    res.status(200).json({
        status: "success",
        message: "Password updated successfully",
        token,
        data: { user }
    });

});

// update email
exports.updateEmail = asyncErrorHandler(async (req, res, next) => {

});

exports.verifyEmail = asyncErrorHandler(async (req, res, next) => {

});

// Delete Account
exports.deleteAccount = asyncErrorHandler(async (req, res, next) => {
    // Fetch user and soft delete
    const user = await User.findOneAndUpdate({ _id: req.user._id }, { active: false }, { new: true, runValidators: true });

    //console.log(user);

    res.status(204).json({});

});

// Update Profile details
// Allowed Fields: fname, lname, email 
exports.updateProfile = asyncErrorHandler(async (req, res, next) => {
    const allowedFields = ["firstname", "lastname", "photo"];

    const filteredRequestObj = filterRequestObj(req.body, allowedFields);

    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredRequestObj, { new: true, runValidators: true });

    res.status(200).json({
        status: "success",
        message: "Profile Updated successfully!",
        data: { user: updatedUser }
    });


});

// Display user profile
exports.getProfile = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
        status: "success",
        data: { user }
    });
});
