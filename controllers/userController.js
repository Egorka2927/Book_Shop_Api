const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        const user = await User.findById(id);

        if (!user) {
            error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

exports.createUser = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.username});

        if (user) {
            const error = new Error("User with such username already exists");
            error.status = 409;
            throw error;
        }

        const newUser = new User(req.body);
        const hashedPassword = await bcrypt.hash(newUser.password, 10);

        newUser.password = hashedPassword;

        await newUser.save();

        res.status(201).json({id: newUser.id});
    } catch (error) {
        next(error);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        
        const updatedUser = await User.findByIdAndUpdate(id, req.body, {new: true});

        if (!updatedUser) {
            error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({message: "User deleted successfuly"});
    } catch (error) {
        next(error);
    }
}