const express = require("express");

// controllers
const userController = require(`${__dirname}/../Controllers/userController`);

const authMiddleware = require(`${__dirname}/../Middlewares/authMiddleware`);

const orderController = require(`${__dirname}/../Controllers/orderController`);

const router = express.Router();

router.route("/orders").post(authMiddleware, orderController.createOrder);

module.exports = router;