const { BorrowedBook } = require('../models/BorrowedBook');
const Sequelize = require('sequelize');

async function calculateAverageScore(bookId) {
    const { sumOfScores, numOfScores } = await BorrowedBook.findOne({
            attributes: [
                [
                    Sequelize.fn("sum", Sequelize.col("userScore")),
                    "sumOfScores",
                ],
                [
                    Sequelize.fn("count", Sequelize.col("userScore")),
                    "numOfScores",
                ],
            ],
            where: {
                bookId,
                returnDate: { [Sequelize.Op.ne]: null },
            },
        });
        return sumOfScores / numOfScores;
}

module.exports = { calculateAverageScore };
