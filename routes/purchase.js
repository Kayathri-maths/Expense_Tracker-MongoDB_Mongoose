const path = require('path');

const express = require('express');

const router = express.Router();

const purchaseController = require('../controllers/purchase');

const authenticateMiddleware  = require('../middleware/auth');

router.get('/premiummembership',authenticateMiddleware.authenticate , purchaseController.purchasepremium);
 
router.post('/updatetransactionstatus', authenticateMiddleware.authenticate , purchaseController.updateTransactionStatus );


module.exports = router;
