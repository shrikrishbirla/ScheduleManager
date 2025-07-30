const express = require('express')
const users = require('../models/user');
const auth = express.Router();

auth.post('/register', async (req, res) => {
    const {username, role, email, password} = req.body;

    try {
        const exist = await users.findOne({email})
        if(exist) res.status(400).json({message: 'user already exist'});

        const user = new users ({
            username, role, email, password
        })
        await user.save();
        res.status(200).json({message: 'signup successful'})
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

auth.post("/login", async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await users.findOne({username});
        if(!user || user.password !== password) return res.status(400).json({message: 'Invalid credentails'});
        req.session.userID = user._id;
        res.cookie('username', user.username, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });
        res.status(200).json({ message: 'Login successful', role: user.role });
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = auth;

// auth.post('/add-lecture', async (req, res) => {
//     try {
//         const data = await fs.readFile(LectureFile, 'utf8');
//         const lectures = JSON.parse(data);
        
//         const exists = lectures.find(l =>
//             l.teacher === req.body.teacher &&
//             l.day === req.body.day &&
//             l.slot === req.body.slot
//         );

//         if (exists) {
//             return res.status(409).json({ message: "Lecture already assigned for this slot." });
//         }
        
//         lectures.push(req.body);
//         await fs.writeFile(LectureFile, JSON.stringify(lectures, null, 2));
//         res.status(200).json({ message: "Lecture added!" });
//     } catch (err) {
//         console.error("Error saving lecture:", err);
//         res.status(500).send("Server error");
//     }
// });

// auth.get('/lectures', async (req, res) => {
//     try {
//         const data = await fs.readFile(LectureFile, 'utf8');
//         const lectures = JSON.parse(data);
//         res.json(lectures);
//     } catch (err) {
//         console.error("Error reading lectures:", err);
//         res.status(500).send("Server error");
//     }
// });

// auth.post('/leave-request', async (req, res) => {
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