const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message =
    err.message || "Internal server error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;

    const messages = Object.values(
      err.errors
    ).map((error) => error.message);

    message = messages.join(", ");
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  // Duplicate unique field
  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(
      err.keyPattern || {}
    )[0];

    message = `${field} already exists`;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;