// routes/adminRoutes.js
// ------------------------------------------------------------------
// Every route in this file requires BOTH:
//   1. protect     -> user must be logged in (valid JWT)
//   2. adminOnly    -> user's role must be "admin"
// This is where restaurants, food items, and users are managed.
// ------------------------------------------------------------------

const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");

const {
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = require("../controllers/foodItemController");

const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");

const router = express.Router();

// Every request to /api/admin/* must pass through these two checks first.
router.use(protect, adminOnly);

// --- Restaurant management ---
router.post("/restaurants", createRestaurant);
router.put("/restaurants/:id", updateRestaurant);
router.delete("/restaurants/:id", deleteRestaurant);

// --- Food item management ---
router.post("/food", createFoodItem);
router.put("/food/:id", updateFoodItem);
router.delete("/food/:id", deleteFoodItem);

// --- User management ---
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;
