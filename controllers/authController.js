const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require('dotenv').config()

const createToken = (username) => {
    return jwt.sign({username}, process.env.JWT_SECRET_KEY, {expiresIn: 60 * 60 * 3});
}

const createRefreshToken = (username) => {
    return jwt.sign({username}, process.env.JWT_SECRET_KEY, {expiresIn: 60 * 60 * 24 * 2});
}

const createUser = async (userData) => {
    const user = await User.findOne({$or: [
        {username: userData.username},
        {email: userData.email}
    ]});

    if (user) {
        const error = new Error("User with such username or email already exists");
        error.status = 409;
        throw error;
    }

    const newUser = new User(userData);
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    newUser.password = hashedPassword;

    return newUser;
}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
    
        const user = await User.findOne({email: email});
    
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            const error = new Error("Password is wrong");
            error.status = 400;
            throw error;
        }

        const accessToken = createToken(user.username);
        const refreshToken = createRefreshToken(user.username);

        user.accessToken = await bcrypt.hash(accessToken, 10);
        user.refreshToken = await bcrypt.hash(refreshToken, 10);

        await user.save()

        res.cookie("jwtRefreshToken", refreshToken, {httpOnly: true, maxAge: 60 * 60 * 24 * 2 * 1000});

        res.status(200).json({
            jwtToken: accessToken
        });
    } catch (error) {
        next(error);
    }
}

exports.register = async (req, res, next) => {
    try {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
    
        if (password !== confirmPassword) {
            const error = new Error("Passwords do not match");
            error.status = 400;
            throw error;
        }

        const userData = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }

        const newUser = await createUser(userData);

        console.log(newUser);

        const accessToken = createToken(newUser.username);
        const refreshToken = createRefreshToken(newUser.username);

        newUser.accessToken = await bcrypt.hash(accessToken, 10);
        newUser.refreshToken = await bcrypt.hash(refreshToken, 10);

        await newUser.save();

        res.cookie("jwtRefreshToken", refreshToken, {httpOnly: true, maxAge: 60 * 60 * 24 * 2 * 1000});

        res.status(200).json({
            jwtToken: accessToken
        });
    } catch (error) {
        next(error);
    }
}