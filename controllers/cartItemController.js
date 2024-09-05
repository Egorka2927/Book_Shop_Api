const CartItem = require("../models/CartItem");

getAllCartItems = async (req, res, next) => {
    try {
        const cartItems = await CartItem.find();

        res.status(200).json(cartItems);
    } catch (error) {
        next(error);
    }
}

getCartItem = async (req, res, next) => {
    try {
        const id = req.params.id;
        const cartItem = await CartItem.findById(id);

        if (!cartItem) {
            const error = new Error("Cart item now found");
            error.status = 404;
            throw error;
        }

        res.status(200).json(cartItem);
    } catch (error) {
        next(error);
    }
}

createCartItem = async (req, res, next) => {
    try {
        const cartItem = await CartItem.findOne({userId: req.body.userId, bookId: req.body.bookId});

        if (cartItem) {
            const error = new Error("Book already added to the shopping cart");
            error.status = 409;
            throw error;
        }

        const newCartItem = new CartItem(req.body);

        await newCartItem.save();

        res.status(201).json({id: newCartItem.id});
    } catch (error) {
        next(error);
    }
}

updateCartItem = async (req, res, next) => {
    try {
        const id = req.params.id;

        const updatedCartItem = await CartItem.findByIdAndUpdate(id, req.body, {new: true});

        if (!updatedCartItem) {
            const error = new Error("Cart item not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json(updatedCartItem);
    } catch (error) {
        next(error);
    }
}

deleteCartItem = async (req, res, next) => {
    try {
        const id = req.params.id;

        const cartItem = await CartItem.findByIdAndDelete(id);

        if (!cartItem) {
            const error = new Error("Cart item not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({message: "Cart item deleted successfuly"});
    } catch (error) {
        next(error);
    }
}

module.exports = {getAllCartItems, getCartItem, createCartItem, updateCartItem, deleteCartItem};