// controllers/foodItemController.js
// ------------------------------------------------------------------
// This is the core "price comparison" logic of the whole app.
// ------------------------------------------------------------------

const FoodItem = require("../models/FoodItem");

// @route   GET /api/food
// @query   ?search=burger&category=Fast+Food&sortBy=priceLowToHigh
// @access  Public
const getFoodItems = async (req, res, next) => {
  try {
    const { search, category, sortBy } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    // Populate "restaurant" so the frontend gets restaurant name/image
    // without needing a second API call.
    let items = await FoodItem.find(query).populate(
      "restaurant",
      "name image address rating deliveryTime"
    );

    // Sorting is done AFTER fetching because we sometimes sort by a
    // computed value (the cheaper of the two platform prices).
    if (sortBy === "priceLowToHigh") {
      items = items.sort(
        (a, b) =>
          Math.min(a.swiggyPrice, a.zomatoPrice) -
          Math.min(b.swiggyPrice, b.zomatoPrice)
      );
    } else if (sortBy === "priceHighToLow") {
      items = items.sort(
        (a, b) =>
          Math.min(b.swiggyPrice, b.zomatoPrice) -
          Math.min(a.swiggyPrice, a.zomatoPrice)
      );
    } else if (sortBy === "ratingHighToLow") {
      items = items.sort((a, b) => b.rating - a.rating);
    }

    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/food/:id
// @access  Public
const getFoodItemById = async (req, res, next) => {
  try {
    const item = await FoodItem.findById(req.params.id).populate(
      "restaurant"
    );

    if (!item) {
      res.status(404);
      throw new Error("Food item not found");
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/food/categories
// Returns a distinct list of all categories, used to build filter
// buttons/dropdowns on the frontend.
const getCategories = async (req, res, next) => {
  try {
    const categories = await FoodItem.distinct("category");
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/food  (admin only)
const createFoodItem = async (req, res, next) => {
  try {
    const item = await FoodItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/food/:id  (admin only)
const updateFoodItem = async (req, res, next) => {
  try {
    const item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      res.status(404);
      throw new Error("Food item not found");
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/food/:id  (admin only)
const deleteFoodItem = async (req, res, next) => {
  try {
    const item = await FoodItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Food item not found");
    }

    await item.deleteOne();
    res.json({ message: "Food item deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFoodItems,
  getFoodItemById,
  getCategories,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
};
