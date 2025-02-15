const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, borrowBook, returnBook } = require('../controllers/userController');
const { createUserValidator, borrowBookValidator, returnBookValidator } = require('../validators/userValidator');

router.get('/', getUsers);

router.get('/:user_id', getUser);

router.post('/', createUserValidator, createUser);

router.post('/:user_id/borrow/:book_id', borrowBookValidator, borrowBook);

router.post('/:user_id/return/:book_id', returnBookValidator, returnBook);

module.exports = router;
