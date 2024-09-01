const mongoose = require("mongoose");

const CartItem = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        default: 1
    }
})

module.exports = mongoose.model("CartItem", CartItem);