const express = require('express')
const authController = require("../controllers/authControllers");
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update', authController.update);
router.get('/logout', authController.logout);

module.exports = router;