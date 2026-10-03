const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Optional Auth Middleware:
 * Extracts user if token is present, but doesn't block unauthenticated requests.
 */
const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'careerconnect_secret_fallback'
      );
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (err) {
      // Ignore token verification errors for optional auth
    }
  }
  next();
};

module.exports = { optionalAuth };
