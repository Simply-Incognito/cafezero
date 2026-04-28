const mongoose = require("mongoose"),
    validator = require("validator");


const orderSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Order must have a name."],
        trim: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        required: [true, "Price is required!"]
    },
    description: {
        type: String,
        default: "No description available."
    },
    discount: {
        type: Number,
        default: 0,
        max: [1, "Maximum discount is 100%"]
    }
});

orderSchema.pre('save', async function () {
    this.price = (this.price * this.quantity) * this.discount;
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;