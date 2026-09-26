// controllers/adminController.js
// ------------------------------------------------------------------
// Admin-only user management. Restaurant/FoodItem CRUD already live
// in their own controllers (reused by adminRoutes.js) to avoid
// duplicating logic.
// ------------------------------------------------------------------

const User = require("../models/User");

// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/admin/users/:id/role
// Promote/demote a user between "user" and "admin".
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      res.status(400);
      throw new Error("Role must be 'user' or 'admin'");
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
