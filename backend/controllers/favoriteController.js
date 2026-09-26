// controllers/favoriteController.js
// ------------------------------------------------------------------
// Lets a logged-in user save/remove/view favorite food items.
// All routes here require the "protect" middleware (must be logged in).
// ------------------------------------------------------------------

const User = require("../models/User");

// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      populate: { path: "restaurant", select: "name image" },
    });

    res.json(user.favorites);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/favorites/:foodItemId
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { foodItemId } = req.params;

    // Avoid duplicate entries in the favorites array.
    if (!user.favorites.includes(foodItemId)) {
      user.favorites.push(foodItemId);
      await user.save();
    }

    res.status(200).json({ message: "Added to favorites", favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/favorites/:foodItemId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { foodItemId } = req.params;

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== foodItemId
    );
    await user.save();

    res.status(200).json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
