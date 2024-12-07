const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, borrowBook, returnBook } = require('../controllers/userController');
const { createUserValidator, borrowBookValidator, returnBookValidator } = require('../validators/userValidator');

router.get('/users', getUsers);

router.get('/users/:userId', getUser);

router.post('/users', createUserValidator, createUser);

router.post('/users/:userId/borrow/:bookId', borrowBookValidator, borrowBook);

router.post('/users/:userId/return/:bookId', returnBookValidator, returnBook);

module.exports = router;
