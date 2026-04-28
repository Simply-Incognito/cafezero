"use strict";

const express = require("express");

const userController = require(`${__dirname}/../Controllers/userController`);

const authMiddleware = require(`${__dirname}/../Middlewares/authMiddleware`);

const router = express.Router();

router.route('/profile').get(authMiddleware, userController.getProfile);

router.route('/profile/update').patch(authMiddleware, userController.updateProfile);

router.route('/update-password').patch(authMiddleware, userController.updatePassword);      

router.route('/profile/delete').delete(authMiddleware, userController.deleteAccount);

module.exports = router;