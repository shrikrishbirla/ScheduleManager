const lectures = require('../models/lecture');
const users = require('../models/user');

exports.addlecture = async (req, res) => {
     const { subjectName, roomNumber, day, date, startTime, endTime, lectureNumber, teacher } = req.body;

    try {
        const currentTeacher = await users.find({username: teacher});
        const teacherID = currentTeacher._id;

        const exists = await lectures.findOne({ subjectName, roomNumber, day, date, startTime, endTime, lectureNumber, teacherID});
        
        if (exists) {
            return res.status(409).json({ message: "Lecture already assigned for this slot." });
        }
        

        const newLecture = new lectures({ subjectName, roomNumber, day, date, startTime, endTime, lectureNumber, teacherID });
        await newLecture.save();

        res.status(200).json({ message: "Lecture added!" });
    } catch (err) {
        console.error("Error saving lecture:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getlecture = async (req, res) => {
    try {
        const currentUser = await users.findById(req.session.userID).select('-password');
        res.json(currentUser);
    } catch (err) {
        console.error("Error reading lectures:", err);
        res.status(500).send("Server error");
    }
};