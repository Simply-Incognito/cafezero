const jwt = require('jsonwebtoken'),
    crypto = require("crypto");
const passport = require('passport');

const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);

const CustomError = require(`${__dirname}/../Utils/CustomError`);

const sendResetTokenEmail = require(`${__dirname}/../Utils/email`);

// Model
const User = require(`${__dirname}/../Models/userModel`);

const createToken = (id) => {
    return jwt.sign({ id: id }, process.env.PRIVATE_KEY, { expiresIn: process.env.TOKEN_EXPIRES_IN })
}

// SIGN UP
exports.createUser = asyncErrorHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    // Generate JWT token
    const token = createToken(user._id);

    // Set JWT as cookie
    res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript from accessing it
        secure: false, // Set to true in production with HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    });

    res.status(201).json({  
        status: 'success',
        message: 'User created successfully',
        data: { user },
        token // Also send token in response for API clients
    });
});

// Google OAuth callback handler
exports.googleCallbackFunc = asyncErrorHandler(async (req, res, next) => {
    // After successful Google authentication, req.user contains the database user
    if (!req.user) {
        return res.redirect('http://localhost:3000/auth?error=authentication_failed');
    }

    // Generate JWT token for the user
    const token = createToken(req.user._id);

    // Set JWT as cookie so the frontend can stay logged in
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set to true in production
        maxAge: 1000 * 60 * 60 * 24
    });

    // Redirect back to the frontend auth page with a success message flag
    res.redirect('http://localhost:3000/auth?login=success');
});


// LOGIN - GET /login (email, password)
exports.login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new CustomError("Invalid request. Email or password missing.", 400));
    }

    // Verfify if user exists using user email
    const user = await User.findOne({ email: req.body.email }).select("+password");

    if (!user) {
        return next(new CustomError("Account not found. Please create an account.", 404));
    }

    // Verify password
    const isValidPassword = await user.ValidateUserPassword(req.body.password, user.password)

    if (!isValidPassword) {
        return next(new CustomError("Incorrect password. Please try again.", 404));
    }

    // Check if user account is active
    if (!user.active) {
        return next(new CustomError("Your account is disabled! Please contact the administrator.", 403));
    }


    // Generate JWT
    const token = createToken(user._id);

    // Set JWT as cookie
    res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript from accessing it
        secure: false, // Set to true in production with HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    });

    res.status(200).json({
        status: "success",
        message: "Login successful",
        user: {
            id: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname
        },
        token // Also send token for API clients
    });
});

// FORGOT PASSWORD
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
    // GET USER USING EMAIL
    const user = await User.findOne({ email: req.body.email }).select("+password");

    if (!user) {
        return next(new CustomError("Account does not exist.", 404));
    }

    // GENERATE PASSWORD RESET TOKEN
    const resetToken = await user.generatePasswordResetToken();

    // save token and expiry to DB
    user.save({ validateBeforeSave: false });

    // SEND PASSWORD RESET EMAIL
    // http://127.0.0.1:8080/api/v1/auth/password-reset/token

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/password-reset/${resetToken}`;
    const message = `Please follow the link below to reset your password. Link expires in 5 minutes!\n\n${resetUrl}`;


    try {
        await sendResetTokenEmail({ email: user.email, subject: "Password Reset Request", message: message });

        res.status(200).json({
            status: "success",
            message: "Please check your mail to change your password."
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.save({ validateBeforeSave: false });

        return next(new CustomError("Password reset email not sent. Please try again later."));
    }
});

// RESET PASSWORD
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    // When the user later submits the token from their email, 
    // you hash it again and compare it with what's stored in the database

    // Rehash provided token and verify against DB
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetTokenExpires: { $gt: Date.now() } });

    if (!user) {
        return next(new CustomError("Invalid reset token or Password reset link expired. Please try agan later", 404));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new CustomError("Passwords do not match!", 400));
    }

    // Change user password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    await user.save({ validateBeforeSave: true });

    res.status(200).json({
        status: "success",
        message: "Password changed successfully."
    });
});