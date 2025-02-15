const BorrowedBook = require("../models/borrowed_book");
const Sequelize = require("sequelize");

async function calculateAverageScore(book_id) {
    const result = await BorrowedBook.findOne({
        attributes: [
            [Sequelize.fn("sum", Sequelize.col("user_score")), "sumOfScores"],
            [Sequelize.fn("count", Sequelize.col("user_score")), "numOfScores"],
        ],
        where: {
            book_id,
            return_date: { [Sequelize.Op.ne]: null },
        },
        raw: true,
    });

    const sumOfScores = result.sumOfScores;
    const numOfScores = result.numOfScores;

    return sumOfScores / numOfScores;
}

module.exports = { calculateAverageScore };
