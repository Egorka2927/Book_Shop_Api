const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1];
    
        if (accessToken) {
            jwt.verify(accessToken, process.env.JWT_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    const error = new Error("Unauthorized access");
                    error.status = 401;
                    throw error;
                } else {
                    try {
                        const user = await User.findOne({username: decoded.username});
        
                        if (!user) {
                            const error = new Error("User not found");
                            error.status = 401;
                            throw error;
                        }
        
                        req.user = user;
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            });
        } else {
            const error = new Error("Unauthorized access");
            error.status = 401;
            throw error;
        }
    } catch (error) {
        const newError = new Error("Unauthorized access");
        newError.status = 401;
        next(newError);
    }
}

module.exports = {verifyToken};