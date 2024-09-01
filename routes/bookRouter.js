const express = require("express");
const { getAllBooks, getBook, createBook, updateBook, deleteBook } = require("../controllers/bookController");
const router = express.Router();

router.get("/", getAllBooks);

router.get("/:id", getBook);

router.post("/book", createBook);

router.put("/:id", updateBook);

router.delete("/id", deleteBook);

module.exports = router;