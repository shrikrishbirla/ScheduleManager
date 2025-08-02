const express = require('express')
const isAuth = require('../middleware/authMiddleware');
const lectureControllers = require("../controllers/lectureControllers");
const router = express.Router();


router.post('/add-lecture', isAuth, lectureControllers.addlecture);
router.get('/list', isAuth, lectureControllers.teacherList);
router.get('/currentuser', isAuth, lectureControllers.currentUser);
router.get('/lectures/:teacherId', isAuth, lectureControllers.getlecture);
router.post('/leave-request', isAuth, lectureControllers.leaveRequest);

module.exports = router;