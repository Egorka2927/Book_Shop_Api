const express = require("express");
const app = express();
const port = 8080;
const userRouter = require("./routes/userRouter");
const bookRouter = require("./routes/bookRouter");
const cartItemRouter = require("./routes/cartItemRouter");
const authRouter = require("./routes/authRouter");
const mongoose = require("mongoose");
require('dotenv').config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.log(error);
    }
}

app.use(express.json());

app.use("/users", userRouter);

app.use("/books", bookRouter);

app.use("/cart_items", cartItemRouter);

app.use("/auth", authRouter);

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message
    });
});

app.listen(port, () => {
    connect();
    console.log(`The server is listening to the port ${port}`)
});

