"use strict";

const express = require("express");

const userController = require(`${__dirname}/../Controllers/userController`);

const authMiddleware = require(`${__dirname}/../Middlewares/authMiddleware`);

const router = express.Router();

router.route('/update-password').patch(authMiddleware, userController.updatePassword);

router.route('/update-profile').patch(authMiddleware, userController.updateProfile);

router.route('/delete-account').delete(authMiddleware, userController.deleteAccount);

router.route('/profile').get(authMiddleware, userController.getProfile);


module.exports = router;