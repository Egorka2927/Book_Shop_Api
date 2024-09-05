const express = require("express");
const { getAllCartItems, getCartItem, createCartItem, updateCartItem, deleteCartItem } = require("../controllers/cartItemController");
const { verifyToken } = require("../middlewares/jwtFilter");
const router = express.Router();

router.get("/", verifyToken, getAllCartItems);

router.get("/:id", verifyToken, getCartItem);

router.post("/cart_item", verifyToken, createCartItem);

router.put("/:id", verifyToken, updateCartItem);

router.delete("/:id", verifyToken, deleteCartItem);

module.exports = router;