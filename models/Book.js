"use strict";
const { Model, DataTypes } = require("sequelize");
const db = require("../config/database");
const BorrowedBook = require("./borrowed_book");

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

Book.hasMany(BorrowedBook, { foreignKey: "book_id" });
BorrowedBook.belongsTo(Book, { foreignKey: "book_id" });

module.exports = Book;
