const express = require('express')
const users = require('../models/user');
const role = express.Router();

function isAuthenticated(req, res, next) {
  if (req.session.userID) return next();
  return res.redirect('/');
}

role.get('/admin', isAuthenticated ,async (req, res) => {
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
});

role.get('/teacher', isAuthenticated , async (req, res) => {
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
});

role.get('/role/users', async (req, res) => {
    try {
    const currentUser = await users.findById(req.session.userID).select('-password');
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).send("Access denied.");
    }

    const allUsers = await users.find().select('-password'); // exclude passwords
    res.json(allUsers);
  } catch (err) {
    console.error("Error loading users:", err);
    res.status(500).send("Server error");
  }
});

module.exports = role;
