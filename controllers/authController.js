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

const refreshToken = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1];
        const refreshToken = req.cookies.jwtRefreshToken;
    
        const username = await getUsernameFromToken(refreshToken);
    
        if (!username) {
            res.status(401).json({status: 401, message: "Invalid token"});
        }
    
        const user = await User.findOne({username: username});
    
        const accessTokensMatch = await bcrypt.compare(accessToken, user.accessToken);
    
        if (!accessTokensMatch) {
            res.status(401).json({status: 401, message: "Access token is old"});
        }
    
        const refreshTokensMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    
        if (!refreshTokensMatch) {
            res.status(401).json({status: 401, message: "Refresh token is old"});
        }
    
        const newAccessToken = createToken(username);
        const newRefreshToken = createRefreshToken(username);
    
        user.accessToken = await bcrypt.hash(newAccessToken, 10);
        user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
    
        await user.save();
    
        res.cookie("jwtRefreshToken", newRefreshToken, {httpOnly: true, maxAge: 60 * 60 * 24 * 2 * 1000});
    
        res.status(200).json({
            jwtToken: newAccessToken
        });
    } catch (error) {
        next(error);
    }
}

const getUsernameFromToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return reject(err);
            }
    
            resolve(decoded.username);
        });
    })
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

const login = async (req, res, next) => {
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

const register = async (req, res, next) => {
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

module.exports = {createToken, createRefreshToken, login, register, refreshToken};