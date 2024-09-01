const mongoose = require("mongoose");

const Book = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    genre: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model("Book", Book);