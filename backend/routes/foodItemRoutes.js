// routes/foodItemRoutes.js
// ------------------------------------------------------------------
// Public routes for searching/browsing/comparing food items.
// ------------------------------------------------------------------

const express = require("express");
const {
  getFoodItems,
  getFoodItemById,
  getCategories,
} = require("../controllers/foodItemController");

const router = express.Router();

// IMPORTANT: "/categories" must be declared BEFORE "/:id",
// otherwise Express would treat "categories" as an :id value.
router.get("/categories", getCategories);
router.get("/", getFoodItems);       // GET /api/food?search=&category=&sortBy=
router.get("/:id", getFoodItemById); // GET /api/food/:id

module.exports = router;
