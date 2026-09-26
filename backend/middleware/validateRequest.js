// middleware/validateRequest.js
// ------------------------------------------------------------------
// Runs after express-validator's checks (e.g. body("email").isEmail())
// and, if any failed, sends a clean 400 response listing every
// validation error instead of letting the request continue.
// ------------------------------------------------------------------

const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  next();
};

module.exports = validateRequest;
