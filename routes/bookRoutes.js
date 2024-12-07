const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBook } = require('../controllers/bookController');
const { createBookValidator } = require('../validators/bookValidator');

router.get('/books', getBooks);

router.get('/books/:bookId', getBook);

router.post('/books', createBookValidator, createBook);

module.exports = router;
