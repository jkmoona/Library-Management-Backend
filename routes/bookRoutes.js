const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBook } = require('../controllers/bookController');
const { createBookValidator } = require('../validators/bookValidator');

router.get('/', getBooks);

router.get('/:book_id', getBook);

router.post('/', createBookValidator, createBook);

module.exports = router;
