const express = require('express');

const router = express.Router();

const premiumFeacherController = require('../controllers/premiumFeature');

const authenticateMiddleware  = require('../middleware/auth');

router.get('/showLeaderBoard',authenticateMiddleware.authenticate , premiumFeacherController.getUserLeaderBoard);


module.exports = router;
