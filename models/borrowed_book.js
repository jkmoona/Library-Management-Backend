"use strict";
const { DataTypes } = require("sequelize");
const db = require("../config/database");

const BorrowedBook = db.define("borrowed_book", {
    user_score: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    borrow_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = BorrowedBook;
