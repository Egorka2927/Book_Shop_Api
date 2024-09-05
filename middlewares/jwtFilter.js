const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1];
    
        if (accessToken) {
            jwt.verify(accessToken, process.env.JWT_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    res.status(401).json({status: 401, message: "Unauthorized access"});
                } else {
                    try {
                        const user = await User.findOne({username: decoded.username});
        
                        if (!user) {
                            res.status(401).json({status: 401, message: "User not found"});
                        }
        
                        req.user = user;
                        next();
                    } catch (error) {
                        res.status(500).json({status: 500, message: "Internal server error"});
                    }
                }
            });
        } else {
            res.status(401).json({status: 401, message: "Unauthorized access"});
        }
    } catch (error) {
        res.status(401).json({status: 401, message: "Unauthorized access"});
    }
}

module.exports = {verifyToken};