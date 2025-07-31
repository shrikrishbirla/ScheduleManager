module.exports = (req, res, next) => {
  if (!req.session.userID) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  next();
};
