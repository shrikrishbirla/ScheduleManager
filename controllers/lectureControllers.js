const lectures = require('../models/lecture');
const users = require('../models/user');
const mongoose = require('mongoose');

exports.addlecture = async (req, res) => {   
    try {
        const { subjectName, roomNumber, day, date, startTime, endTime, lectureNumber, teacher } = req.body;

        if (!mongoose.Types.ObjectId.isValid(teacher)) {
            return res.status(400).json({ message: "Invalid teacher ID" });
        }

        const teacherUser = await users.findById(teacher);

        if (!teacherUser) return res.status(404).json({ message: 'Teacher not found' });
        

        const newLecture = new lectures({ subjectName, roomNumber, day, date, startTime, endTime, lectureNumber, teacher: teacherUser._id });
        await newLecture.save();

        console.log("Lecture routes loaded");
        res.status(200).json({ message: "Lecture added!" });
    } catch (err) {
        console.error("Error saving lecture:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getlecture = async (req, res) => {
    try {
        const teacherId = req.params.teacherId;

        const teacherExists = await users.findById(teacherId);
        if (!teacherExists) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const lectureList = await lectures.find({ teacher: teacherId }).populate('teacher', 'username email');
        res.status(200).json(lectureList);
    } catch (err) {
        console.error("Error reading lectures:", err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.teacherList = async (req, res) => {
    try {
        const currentUser = await users.findById(req.session.userId).select('-password');

        if (!currentUser) {
            return res.status(401).json({ message: "User not found or not logged in" });
        }

        const allTeacher = await users.find({ role: 'teacher'}).populate("username email").lean();

        res.status(200).json(allTeacher);
    } catch (err) {
        console.error("Error reading lectures:", err);
        res.status(500).send("Server error");
    }
};

exports.currentUser = async (req, res) => {
    try {
        const currentUser = await users.findById(req.session.userId).select('-password');
        if(!currentUser) {
            return res.status(401).json({ message: "User not found or logged in"});
        }

        res.status(200).json(currentUser);
    } catch (err) {
        console.log("error getting user", err);
        res.status(500).send("Server error");
    }
}