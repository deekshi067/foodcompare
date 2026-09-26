// routes/authRoutes.js
// ------------------------------------------------------------------
// Maps URLs like POST /api/auth/register to their controller function.
// express-validator runs BEFORE the controller and checks the shape
// of the incoming data (e.g. is "email" actually an email?).
// ------------------------------------------------------------------

const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser, getProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  loginUser
);

// "protect" ensures only a logged-in user (valid token) can hit this.
router.get("/profile", protect, getProfile);

module.exports = router;
