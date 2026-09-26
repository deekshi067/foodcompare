// models/FoodItem.js
// ------------------------------------------------------------------
// Defines the "FoodItem" collection — this is the heart of the price
// comparison feature. Each food item stores its Swiggy price, Zomato
// price, and the external URLs used for the "Order Now" redirect.
// ------------------------------------------------------------------

const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food item name is required"],
      trim: true,
    },
    // Reference to the Restaurant this food item belongs to.
    // "ref: 'Restaurant'" lets us use .populate('restaurant') later
    // to automatically fetch the full restaurant details.
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      // e.g. "Pizza", "Burger", "Biryani", "Dessert", "Beverages"
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=Food+Item",
    },

    // --- Price comparison fields -----------------------------------
    swiggyPrice: {
      type: Number,
      required: [true, "Swiggy price is required"],
      min: 0,
    },
    zomatoPrice: {
      type: Number,
      required: [true, "Zomato price is required"],
      min: 0,
    },
    offers: {
      swiggy: { type: String, default: "" }, // e.g. "20% OFF up to ₹100"
      zomato: { type: String, default: "" },
    },

    // --- Redirect links (demo/sample URLs, no scraping/private APIs) -
    swiggyUrl: {
      type: String,
      default: "https://www.swiggy.com",
    },
    zomatoUrl: {
      type: String,
      default: "https://www.zomato.com",
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// A helpful "virtual" field: tells the frontend which platform is
// cheaper without the frontend having to calculate it every time.
foodItemSchema.virtual("cheaperPlatform").get(function () {
  if (this.swiggyPrice === this.zomatoPrice) return "equal";
  return this.swiggyPrice < this.zomatoPrice ? "swiggy" : "zomato";
});

// Make sure virtuals show up when the document is converted to JSON
// (which happens automatically when we send it as an API response).
foodItemSchema.set("toJSON", { virtuals: true });
foodItemSchema.set("toObject", { virtuals: true });

// Text index enables fast, flexible search across name & category.
foodItemSchema.index({ name: "text", category: "text" });

module.exports = mongoose.model("FoodItem", foodItemSchema);
