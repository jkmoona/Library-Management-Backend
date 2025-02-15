const Book = require("../models/book");

// Get all books
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            attributes: { exclude: ["score"] },
        });
        if (!books) {
            return res.status(404).json({ message: "No books found!" });
        }
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get book by id
exports.getBook = async (req, res) => {
    try {
        const book_id = req.params.book_id;
        const book = await Book.findByPk(book_id);
        if (!book) {
            return res.status(404).json({ message: "Book not found!" });
        }

        res.status(200).json({
            id: book.id,
            name: book.name,
            score: book.score,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create book
exports.createBook = async (req, res) => {
    try {
        const book = await Book.create({ name: req.body.name });
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
