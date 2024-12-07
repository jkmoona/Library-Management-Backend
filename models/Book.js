const { DataTypes } = require("sequelize");
const db = require("../config/database");
const BorrowedBook = require("./BorrowedBook");

const Book = db.define("book", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    score: {
        type: DataTypes.FLOAT,
        defaultValue: -1,
    },
});

Book.hasMany(BorrowedBook, { foreignKey: "bookId" });
BorrowedBook.belongsTo(Book, { foreignKey: "bookId" });

module.exports = Book;
