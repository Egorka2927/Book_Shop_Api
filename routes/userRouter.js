const express = require("express");
const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require("../controllers/userController");
const { verifyToken } = require("../middlewares/jwtFilter");
const router = express.Router();

router.get("/", verifyToken, getAllUsers);

router.get("/:id", verifyToken, getUser);

router.post("/user", verifyToken, createUser);

router.put("/:id", verifyToken, updateUser);

router.delete("/:id", verifyToken, deleteUser);

module.exports = router;