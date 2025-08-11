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

        if (password === exist.password) {
            return res.status(400).json({ message: 'New password must be different from old password' });
        }

        await users.updateOne(
            { email },
            { $set: { password: password } }
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
