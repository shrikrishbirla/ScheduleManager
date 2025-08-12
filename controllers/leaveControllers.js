const lectures = require('../models/lecture');
const users = require('../models/user');
const mongoose = require('mongoose');
const leave = require('../models/leave');
exports.leaveRequest = async (req, res) => {
    try {
        const { teacher, date, reason } = req.body;

        if (!teacher) {
            return res.status(400).json({ message: "Missing teacherId" });
        }

        const teacherExists = await users.findById(teacher);

        if (!teacherExists) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const newLeave = new leave({ teacher, date, reason });
        await newLeave.save();
        
        res.status(200).json({ message: "Leave requested" });
    } catch (err) {
        console.error("Error saving lecture:", err);
        res.status(500).json({ message: "Server error" });
    }
}