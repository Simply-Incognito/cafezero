"use strict";

const User = require("../Models/userModel");

const asyncErrorHandler = require(`${__dirname}/../Utils/asyncErrorHandler`);

const CustomError = require(`${__dirname}/../Utils/CustomError`);

// Order Model
const Order = require(`${__dirname}/../models/orderModel`);

exports.createOrder = asyncErrorHandler(async (req, res, next) => {
    // Add user ID to order if not present
    if (!req.body.user) req.body.user = req.user._id;
    
    const order = await Order.create(req.body);

    res.status(201).json({
        status: "success",
        message: "Order created successfully.",
        data: { order }
    });
});

exports.GetAllOrders = asyncErrorHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');

    res.status(200).json({
        status: "success",
        results: orders.length,
        data: { orders }
    });
});
