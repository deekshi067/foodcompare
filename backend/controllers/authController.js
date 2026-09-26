// controllers/authController.js
// ------------------------------------------------------------------
// Handles user registration, login, and fetching the logged-in
// user's own profile.
// ------------------------------------------------------------------

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Small helper: creates a signed JWT containing the user's ID.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic manual validation (express-validator handles more in routes)
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please provide name, email and password");
    }

    // Check if a user with this email already exists.
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("A user with this email already exists");
    }

    // Create the user. The password gets hashed automatically by the
    // "pre save" hook we defined in models/User.js.
    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error); // forward to errorMiddleware.js
  }
};

// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    // We must explicitly ".select('+password')" because the schema
    // sets "select: false" on the password field by default.
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/profile
// @access  Private (requires valid JWT)
const getProfile = async (req, res, next) => {
  try {
    // req.user was attached by the "protect" middleware.
    const user = await User.findById(req.user._id).populate(
      "favorites"
    );
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getProfile };
