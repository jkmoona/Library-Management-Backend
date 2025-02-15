const User = require("../models/user");
const Book = require("../models/book");
const BorrowedBook = require("../models/borrowed_book");

const userService = require("../services/userService");

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        if (!users) {
            return res.status(404).json({ message: "No users found!" });
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user by id
exports.getUser = async (req, res) => {
    const user_id = req.params.user_id;

    try {
        // Find user by id
        const user = await User.findByPk(user_id);
        if (!user) {
            return res
                .status(404)
                .json({ message: `User not found! id: ${user_id}` });
        }

        // Get borrowed books of the user
        const borrowedBooks = await BorrowedBook.findAll({
            where: { user_id },
            include: [
                {
                    model: Book,
                    attributes: ["name"],
                },
            ],
        });

        const pastBooks = [];
        const presentBooks = [];

        // Seperate into past and present books
        borrowedBooks.forEach((borrowedBook) => {
            if (borrowedBook.return_date) {
                pastBooks.push({
                    name: borrowedBook.book.name,
                    user_score: borrowedBook.user_score,
                });
            } else {
                presentBooks.push({
                    name: borrowedBook.book.name,
                });
            }
        });

        res.status(200).json({
            id: user.id,
            name: user.name,
            books: {
                past: pastBooks,
                present: presentBooks,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create user
exports.createUser = async (req, res) => {
    try {
        const user = await User.create({ name: req.body.name });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Borrow book
exports.borrowBook = async (req, res) => {
    const { user_id, book_id } = req.params;

    try {
        // Check if the user exists
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Check if the book exists
        const book = await Book.findByPk(book_id);
        if (!book) {
            return res.status(404).json({ message: "Book not found!" });
        }

        // Check if the book is already borrowed
        const existingBorrow = await BorrowedBook.findOne({
            where: {
                book_id,
                return_date: null,
            },
        });

        if (existingBorrow) {
            if (user_id == existingBorrow.user_id) {
                // The book is borrowed by the user
                return res
                    .status(400)
                    .json({ message: "Book is already borrowed by the user!" });
            } else {
                // The book is borrowed by another user
                return res
                    .status(400)
                    .json({ message: "Book is borrowed by another user!" });
            }
        }

        // Borrow the book
        await BorrowedBook.create({
            user_id,
            book_id,
            borrow_date: new Date(),
            return_date: null,
        });

        res.status(204).json({ message: "Book borrowed successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Return a book for a user
exports.returnBook = async (req, res) => {
    const { user_id, book_id } = req.params;
    const score = req.body.score;

    try {
        // Check if the user exists
        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the book exists
        const book = await Book.findByPk(book_id);
        if (!book) return res.status(404).json({ message: "Book not found" });

        // Find the borrowed book record
        const borrowedBook = await BorrowedBook.findOne({
            where: {
                user_id,
                book_id,
                return_date: null,
            },
        });

        if (!borrowedBook) {
            return res.status(400).json({
                message:
                    "Book was already not borrowed or has already been returned",
            });
        }

        // Check if the score is valid --> [1,10]
        if (score < 1 || score > 10) {
            return res
                .status(400)
                .json({ message: "Score must be between 1 and 10" });
        }

        // Update the borrowed book record
        borrowedBook.return_date = new Date();
        borrowedBook.user_score = score;
        await borrowedBook.save();

        // Recalculate the average score for the book
        const averageScore = await userService.calculateAverageScore(book_id);

        // Update the average score
        await book.update({ score: averageScore });

        res.status(204).json({ message: "Book returned successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
