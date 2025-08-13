const express = require('express')
const router = express.Router();

router.get("/verify-otp", (request, response) => {
    response.render("verify-otp");
})

router.get("/password-reset", (request, response) => {
    response.render("reset-password");
})

module.exports = router;