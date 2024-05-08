const path = require('path');

const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/expense');

const userAuthentication  = require('../middleware/auth');
 
router.post('/addexpense', userAuthentication.authenticate , expenseController.addExpense);
router.get('/get-expenses',userAuthentication.authenticate ,expenseController.getexpenses);
router.delete('/delete-expense/:id',userAuthentication.authenticate ,expenseController.deleteExpense);


module.exports = router;
