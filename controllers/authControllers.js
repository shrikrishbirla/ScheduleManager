const users = require('../models/user');
const bcrypt = require("bcrypt");

let otpStore = {};

exports.register = async (req, res) => {
    const { username, role, email, password } = req.body;
    try {
        const exist = await users.findOne({ email });
        if (exist) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new users({ username, role, email, password: hashedPassword });
        await user.save();

        res.status(200).json({ message: 'Signup successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await users.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) return res.status(400).json({ message: 'Invalid credentials' });

        req.session.userId = user._id;
        res.cookie('username', user.username, { maxAge: 86400000, httpOnly: true });
        res.status(200).json({ message: 'Login successful', role: user.role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await users.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await req.transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is: ${otp}`
        });

        otpStore[email] = {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        };

        res.status(200).json({ message: "OTP sent to email" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.verifyOtp = (req, res) => {
    try {
        const { email, otp } = req.body;
        const record = otpStore[email];
    
        if (!record) return res.status(400).json({ message: "OTP not found or expired" });
        if (record.expiresAt < Date.now()) {
            delete otpStore[email];
            return res.status(400).json({ message: "OTP expired" });
        }
        if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    
        res.status(200).redirect("/auth/password-reset");
    } catch {
        res.status(500).json({ message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, password, confirm } = req.body;
    try {
        const user = await users.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (password !== confirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const samePassword = await bcrypt.compare(password, user.password);
        if (samePassword) {
            return res.status(400).json({ message: 'New password must be different' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await users.updateOne({ email }, { $set: { password: hashedPassword } });

        delete otpStore[email];

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send("Logout failed");
        res.clearCookie('connect.sid');
        res.clearCookie('username');
        res.sendStatus(200);
    });
};
