"use strict";
const { DataTypes } = require("sequelize");
const db = require("../config/database");
const BorrowedBook = require("./borrowed_book");

const User = db.define("user", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

User.hasMany(BorrowedBook, { foreignKey: "user_id" });
BorrowedBook.belongsTo(User, { foreignKey: "user_id" });

module.exports = User;
