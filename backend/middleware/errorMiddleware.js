// middleware/errorMiddleware.js
// ------------------------------------------------------------------
// Centralized error handling so every controller can just
// "throw new Error()" or call next(error) and this file formats a
// consistent JSON error response instead of crashing the server or
// leaking a raw stack trace to the frontend.
// ------------------------------------------------------------------

// Runs when a request hits a URL that doesn't exist on our API.
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error); // pass the error along to errorHandler below
};

// Express recognizes this as an error-handling middleware because it
// takes FOUR arguments (err, req, res, next).
const errorHandler = (err, req, res, next) => {
  // If a controller set res.status() already, keep it; otherwise 500.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose "CastError" happens when an invalid MongoDB ID is used.
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Mongoose duplicate key error (e.g. registering with existing email).
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate value entered for field: ${Object.keys(err.keyValue)}`;
  }

  res.status(statusCode).json({
    message,
    // Only show the stack trace in development, never in production.
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
