const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

const expenseController = require('../controllers/expense');

const authenticateMiddleware  = require('../middleware/auth');

router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.get('/download',authenticateMiddleware.authenticate, expenseController.downloadexpenses);


module.exports = router;
