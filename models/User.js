const mongoose = require("mongoose");

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    role: {
        type: String,
        required: true,
        default: "ROLE_USER"
    },

    accessToken: {
        type: String,
        required: true,
    },

    refreshToken: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("User", User);