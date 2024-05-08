const express = require('express');

const router = express.Router();

const resetpasswordController = require('../controllers/resetpassword');

router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

router.get('/resetpassword/:id', resetpasswordController.resetpassword)

router.use('/forgotpassword', resetpasswordController.forgotpassword)


module.exports = router;