const users = require('../models/user');
const bcrypt = require("bcrypt");
exports.register = async (req, res) => {
    const {username, role, email, password} = req.body;
    try {
        const exist = await users.findOne({email})
        if(exist) return res.status(400).json({message: 'user already exist'});

        const hashedpassword = await bcrypt.hash(password, 10);

        const user = new users ({
            username, role, email, password: hashedpassword
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
        const isMatched = await bcrypt.compare(password, user.password);
        if(!user || !isMatched) return res.status(400).json({message: 'Invalid credentails'});
        req.session.userId = user._id;
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

exports.update = async (req, res) => {
    const { email, password, confirm } = req.body;

    try {
        const exist = await users.findOne({ email });
        if (!exist) {
            return res.status(400).json({ message: 'user not found' });
        }

        if (password !== confirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const samePassword = await bcrypt.compare(password, exist.password);
        if (samePassword) {
            return res.status(400).json({ message: 'New password must be different from old password' });
        }
                
        const hashedPassword = await bcrypt.hash(password, 10);
        await users.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.logout = (req, res) => {
    req.session.destroy(err => {

    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Logout failed");
    }

    res.clearCookie('connect.sid', { path: '/'});
    res.clearCookie('username', { path: '/'});
    res.sendStatus(200);
  });
};
