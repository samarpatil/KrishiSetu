const ApiError = require("../utils/ApiError");

const isValidObjectId = (value) => {
  return /^[0-9a-fA-F]{24}$/.test(value);
};

const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const value = req.params[paramName];

    if (!value || !isValidObjectId(value)) {
      return next(
        new ApiError(400, `Invalid ${paramName}`)
      );
    }

    next();
  };
};

const validatePagination = (req, res, next) => {
  let page = Number(req.query.page || 1);
  let limit = Number(req.query.limit || 10);

  if (Number.isNaN(page) || page < 1) {
    page = 1;
  }

  if (Number.isNaN(limit) || limit < 1) {
    limit = 10;
  }

  // Prevent very large requests
  if (limit > 50) {
    limit = 50;
  }

  req.pagination = {
    page,
    limit,
    skip: (page - 1) * limit,
  };

  next();
};

module.exports = {
  isValidObjectId,
  validateObjectId,
  validatePagination,
};