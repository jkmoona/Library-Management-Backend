const { DataTypes } = require("sequelize");
const db = require("../config/database");
const BorrowedBook = require("./BorrowedBook");

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

User.hasMany(BorrowedBook, { foreignKey: "userId" });
BorrowedBook.belongsTo(User, { foreignKey: "userId" });

module.exports = User;
