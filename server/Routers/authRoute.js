const express = require('express');

const router = express.Router();

// Controllers
const authController = require(`${__dirname}/../Controllers/authController`);
const passport = require('passport');

router.route('/signup').post(authController.createUser);

router.route('/login').post(authController.login);

router.route('/google').get(passport.authenticate('google', { scope: ["email", "profile"] }));

// This is the callback route that Google will redirect to after authentication. 
// It will handle the response from Google and authenticate the user in our application.
router.route('/google/callback').get(
    passport.authenticate('google', { failureRedirect: '/login' }),
    authController.googleCallbackFunc
);

router.route('/forgot-password').post(authController.forgotPassword);

router.route('/password-reset/:token').post(authController.resetPassword);

module.exports = router;