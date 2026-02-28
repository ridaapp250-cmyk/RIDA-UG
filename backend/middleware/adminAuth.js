module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: 'Not authenticated' });
  }

  if (req.user.userType !== 'admin') {
    return res.status(403).json({ msg: 'Authorization denied: Not an admin' });
  }

  next();
};
