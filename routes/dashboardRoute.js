const express = require('express')
const isAuth = require('../middleware/authMiddleware');
const router = express.Router();

router.get("/admin-dashboard", isAuth, (request, response) => {
    response.render("admin-dashboard");
})

router.get("/teacher-dashboard", isAuth, (request, response) => {
    response.render("teacher-dashboard");
}) 

module.exports = router;