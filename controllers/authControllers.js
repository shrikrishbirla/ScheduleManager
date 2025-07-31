const users = require('../models/user');

exports.register = async (req, res) => {
    const {username, role, email, password} = req.body;
    try {
        const exist = await users.findOne({email})
        if(exist) return res.status(400).json({message: 'user already exist'});
        const user = new users ({
            username, role, email, password
        })
        await user.save();
        res.status(200).json({message: 'signup successful'})
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.login = async (req, res) => {
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
};