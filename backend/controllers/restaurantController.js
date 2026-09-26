// controllers/restaurantController.js
// ------------------------------------------------------------------
// Public read endpoints (anyone can browse restaurants) + admin-only
// create/update/delete endpoints (protected in routes/adminRoutes.js
// or guarded inline here where reused).
// ------------------------------------------------------------------

const Restaurant = require("../models/Restaurant");
const FoodItem = require("../models/FoodItem");

// @route   GET /api/restaurants
// @query   ?search=pizza&category=Italian
// @access  Public
const getRestaurants = async (req, res, next) => {
  try {
    const { search, category } = req.query;

    // Build a MongoDB query object dynamically based on what filters
    // were passed in the URL.
    const query = {};

    if (search) {
      // "i" = case-insensitive regex search on the name field
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.categories = { $in: [category] };
    }

    const restaurants = await Restaurant.find(query).sort({ rating: -1 });
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/restaurants/:id
// @access  Public
// Returns restaurant details PLUS all its food items in one call,
// which is exactly what the "Restaurant Details" page needs.
const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant not found");
    }

    const foodItems = await FoodItem.find({ restaurant: restaurant._id });

    res.json({ restaurant, foodItems });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/restaurants  (admin only)
const createRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/restaurants/:id  (admin only)
const updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return updated doc, re-run schema validation
    );

    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant not found");
    }

    res.json(restaurant);
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/restaurants/:id  (admin only)
const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant not found");
    }

    // Also remove all food items that belong to this restaurant so
    // we don't leave orphaned data behind.
    await FoodItem.deleteMany({ restaurant: restaurant._id });
    await restaurant.deleteOne();

    res.json({ message: "Restaurant and its food items deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
