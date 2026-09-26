// routes/favoriteRoutes.js
// ------------------------------------------------------------------
// Every route here requires a logged-in user, so we apply the
// "protect" middleware to the whole router with router.use().
// ------------------------------------------------------------------

const express = require("express");
const { getFavorites, addFavorite, removeFavorite } = require("../controllers/favoriteController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // applies to every route defined below

router.get("/", getFavorites);
router.post("/:foodItemId", addFavorite);
router.delete("/:foodItemId", removeFavorite);

module.exports = router;
