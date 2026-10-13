const ApiError = require("../utils/ApiError");
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You are not allowed to access this resource"),
      );
    }
    next();
  };
};
module.exports = allowRoles;