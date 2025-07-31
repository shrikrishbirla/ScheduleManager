const users = require('../models/user');

exports.admin = async (req, res) => {
    const admin = await users.findById(req.session.userID).select('-password');
    try {
        if (admin && admin.role === 'admin') {
            res.render('admin', { admin });
        }
        else {
            res.status(403).send("Access denied.");
        }
    }
    catch (err) {
        res.status(500).json({message: "something went wrong: ", err})
    }
};

exports.teacher = async (req, res) => {
    const teacher = await users.findById(req.session.userID).select('-password');
    try {
        if (teacher && teacher.role === 'teacher') {
            res.render('teacher', { teacher });
        }
        else {
            res.status(403).send("Access denied.");
        }
    }
    catch (err) {
        res.status(500).json({message: "something went wrong: ", err})
    }
};

exports.allUsers = async (req, res) => {
    try {
    const currentUser = await users.findById(req.session.userID).select('-password');
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).send("Access denied.");
    }

    const allUsers = await users.find().select('-password');
    res.json(allUsers);
  } catch (err) {
    console.error("Error loading users:", err);
    res.status(500).send("Server error");
  }
};