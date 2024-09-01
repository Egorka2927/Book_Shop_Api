const express = require("express");
const { getAllCartItems, getCartItem, createCartItem, updateCartItem, deleteCartItem } = require("../controllers/cartItemController");
const router = express.Router();

router.get("/", getAllCartItems);

router.get("/:id", getCartItem);

router.post("/cart_item", createCartItem);

router.put("/:id", updateCartItem);

router.delete("/:id", deleteCartItem);

module.exports = router;