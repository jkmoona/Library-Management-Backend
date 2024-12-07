const { User, BorrowedBook, Book } = require("../models");
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
    const userId = req.params.userId;

    try {
        // Find user by id
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Get borrowed books of the user
        const borrowedBooks = await BorrowedBook.findAll({
            where: { userId },
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
            if (borrowedBook.returnDate) {
                pastBooks.push({
                    name: borrowedBook.Book.name,
                    userScore: borrowedBook.userScore,
                });
            } else {
                presentBooks.push({
                    name: borrowedBook.Book.name,
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
    const { userId, bookId } = req.params;

    try {
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Check if the book exists
        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found!" });
        }

        // Check if the book is already borrowed
        const existingBorrow = await BorrowedBook.findOne({
            where: {
                bookId,
                returnDate: null,
            },
        });
        if (existingBorrow) {
            if (userId === existingBorrow.userId) {
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
            userId,
            bookId,
            borrowDate: new Date(),
            returnDate: null,
        });

        res.status(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Return a book for a user
exports.returnBook = async (req, res) => {
    const { userId, bookId } = req.params;
    const score = req.body.score;

    try {
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the book exists
        const book = await Book.findByPk(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        // Find the borrowed book record
        const borrowedBook = await BorrowedBook.findOne({
            where: {
                userId,
                bookId,
                returnDate: null,
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
        borrowedBook.returnDate = new Date();
        borrowedBook.userScore = score;
        await borrowedBook.save();

        // Recalculate the average score for the book
        const averageScore = await userService.calculateAverageScore(bookId);

        // Update the average score
        await book.update({ score: averageScore });

        res.status(204);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};
