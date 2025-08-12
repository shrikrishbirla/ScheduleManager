const express = require('express')
const isAuth = require('../middleware/authMiddleware');
const leaveController = require('../controllers/leaveControllers');
const router = express.Router();

router.post('/leave-request', isAuth, leaveController.leaveRequest);

module.exports = router;
