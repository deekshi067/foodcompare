// routes/restaurantRoutes.js
// ------------------------------------------------------------------
// Public browsing routes for restaurants. Create/Update/Delete are
// exposed separately under /api/admin (see adminRoutes.js) so it's
// crystal clear which endpoints require admin rights.
// ------------------------------------------------------------------

const express = require("express");
const { getRestaurants, getRestaurantById } = require("../controllers/restaurantController");

const router = express.Router();

router.get("/", getRestaurants);        // GET /api/restaurants?search=&category=
router.get("/:id", getRestaurantById);  // GET /api/restaurants/:id

module.exports = router;
