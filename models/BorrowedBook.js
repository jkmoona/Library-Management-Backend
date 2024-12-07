const { DataTypes } = require("sequelize");
const db = require("../config/database");

const BorrowedBook = db.define("borrowed_book", {
    userScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    borrowDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    returnDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = BorrowedBook;
