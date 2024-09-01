const express = require("express");
const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require("../controllers/userController");
const router = express.Router();

router.get("/", getAllUsers);

router.get("/:id", getUser);

router.post("/user", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;