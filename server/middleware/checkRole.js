const { errorResponse } = require('../utils/apiResponse');

/**
 * Middleware to restrict access based on user roles
 * @param  {...string} roles Allowed roles e.g. ('student'), ('recruiter', 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'User identity not found');
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `User role '${req.user.role}' is not authorized to access this route`
      );
    }

    next();
  };
};

module.exports = { authorize };
