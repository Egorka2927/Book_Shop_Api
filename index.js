const express = require("express");
const app = express();
const port = 8080;
const userRouter = require("./routes/userRouter");
const bookRouter = require("./routes/bookRouter");
const cartItemRouter = require("./routes/cartItemRouter");
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.log(error);
    }
}

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

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

