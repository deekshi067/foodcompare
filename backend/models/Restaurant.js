// models/Restaurant.js
// ------------------------------------------------------------------
// Defines the "Restaurant" collection.
// ------------------------------------------------------------------

const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    image: {
      type: String, // URL to an image (demo data uses placeholder URLs)
      default: "https://via.placeholder.com/400x250?text=Restaurant",
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    // Overall star rating out of 5, e.g. 4.3
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    // e.g. "30-40 mins"
    deliveryTime: {
      type: String,
      default: "30-40 mins",
    },
    // Categories help with search/filter, e.g. ["Pizza", "Italian"]
    categories: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
