const Book = require("../models/Book")

getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find();

        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
}

getBook = async (req, res, next) => {
    try {
        const id = req.params.id;
        const book = await Book.findById(id);

        if (!book) {
            const error = new Error("Book now found");
            error.status = 404;
            throw error;
        }

        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
}

createBook = async (req, res, next) => {
    try {
        const bookName = req.body.name;
        const bookAuthor = req.body.author;

        const book = await Book.findOne({name: bookName, author: bookAuthor});

        if (book) {
            const error = new Error("Book already exists");
            error.status = 409;
            throw error;
        }

        const newBook = new Book(req.body);

        await newBook.save();

        res.status(201).json({id: newBook.id});
    } catch (error) {
        next(error);
    }
}

updateBook = async (req, res, next) => {
    try {
        const id = req.params.id;

        const updatedBook = await Book.findByIdAndUpdate(id, req.body, {new: true});

        if (!updatedBook) {
            const error = new Error("Book not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json(updatedBook);
    } catch (error) {
        next(error);
    }
}

deleteBook = async (req, res, next) => {
    try {
        const id = req.params.id;

        const book = await Book.findByIdAndDelete(id);

        if (!book) {
            const error = new Error("Book not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({message: "Book deleted successfuly"});
    } catch (error) {
        next(error);
    }
}

module.exports = {getAllBooks, getBook, createBook, updateBook, deleteBook};