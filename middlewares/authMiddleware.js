const jwt = require('jsonwebtoken');
const { User } = require('../models'); 

// Basic authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use the ID stored in the token to fetch the user from DB
    const user = await User.findByPk(decoded.userId); // or decoded.id based on your token structure

    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // Attach full user object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
const optionalAuthenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      // No token, continue as guest (no req.user)
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId || decoded.id);

    if (!user) {
      // Token invalid or user not found, continue as guest
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    // Token invalid, continue as guest
    next();
  }
};
// Authorization middleware for role checking
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  optionalAuthenticate,
  authorize,
};
