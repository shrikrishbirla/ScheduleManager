const express = require('express')
const isAuth = require('../middleware/authMiddleware');
const lectureControllers = require("../controllers/lectureControllers");
const router = express.Router();


router.post('/add-lecture', isAuth, lectureControllers.addlecture);
router.get('/lectures', isAuth, lectureControllers.getlecture);


module.exports = router;


// lectureSlot.post('/leave-request', async (req, res) => {
//     try {
//         const data = await fs.readFile(LeaveFile, 'utf8');
//         const leave = JSON.parse(data);

//         leave.push(req.body);
//         await fs.writeFile(LeaveFile, JSON.stringify(leave, null, 2));

//         res.status(200).json({ message: "Leave request sent!" });
//     } catch (err) {
//         console.error("Error on sending leave request:", err);
//         res.status(500).send("Server error");
//     }
// });