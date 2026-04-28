"use strict";

const User = require("../Models/userModel");

const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);

const CustomError = require(`${__dirname}/../Utils/CustomError`);

// Order Model
const Order = require(`${__dirname}/../models/orderModel`);

exports.createOrder = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.create(req.body);

    res.status(201).json({
        status: "success",
        message: "Order created successully.",
        data: { order }
    });
});
