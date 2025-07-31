const express = require('express')
const isAuth = require('../middleware/authMiddleware');
const roleController = require('../controllers/roleControllers');
const router = express.Router();

router.get('/admin', isAuth , roleController.admin)
router.get('/teacher', isAuth , roleController.teacher)
router.get('/role/users', isAuth, roleController.allUsers);

module.exports = router;
