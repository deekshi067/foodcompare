// src/pages/Home.jsx
// ------------------------------------------------------------------
// Landing page: hero search bar, category quick-filters, a grid of
// restaurants, and a grid of all food items — both fetched from the
// API so the home page shows every seeded item.
// ------------------------------------------------------------------

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import RestaurantCard from "../components/RestaurantCard";
import Loader from "../components/Loader";

const QUICK_CATEGORIES = ["Pizza", "Burger", "Biryani", "Dessert", "North Indian", "Fast Food"];

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [foodLoading, setFoodLoading] = useState(true);
  const [error, setError] = useState("");
  const [foodError, setFoodError] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/restaurants");
        setRestaurants(data);
      } catch (err) {
        setError("Could not load restaurants. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    const fetchFoodItems = async () => {
      try {
        setFoodLoading(true);
        // Matches the backend route mounted at app.use("/api/food", ...)
        // in server.js — see routes/foodItemRoutes.js.
        const { data } = await api.get("/food");
        setFoodItems(data);
      } catch (err) {
        setFoodError("Could not load food items. Is the backend running?");
      } finally {
        setFoodLoading(false);
      }
    };

    fetchRestaurants();
    fetchFoodItems();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div>
      {/* Hero section */}
      <section className="text-white-py-16 px-4 bg-cover bg-center">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Compare food prices before you order
          </h1>
          <p className="text-white/90 mb-6">
            See Swiggy vs Zomato prices, ratings & offers side by side — then
            order from whichever platform gives you the best deal.
          </p>
          <form onSubmit={handleSearch} className="flex max-w-lg mx-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 'Pizza', 'Biryani', 'Pizza Paradise'..."
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 rounded-r-lg bg-gray-900 hover:bg-black transition"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Quick category filters */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {QUICK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
              className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow border border-gray-200 dark:border-gray-700 text-sm"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Restaurant grid */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-xl font-semibold mb-4">Popular Restaurants</h2>

        {loading && <Loader />}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {restaurants.map((r) => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
            {restaurants.length === 0 && (
              <p className="text-gray-500 col-span-full">
                No restaurants yet. Run the seed script on the backend:{" "}
                <code>npm run seed</code>
              </p>
            )}
          </div>
        )}
      </section>

      {/* All food items grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-semibold mb-4">All Dishes</h2>

        {foodLoading && <Loader />}
        {foodError && <p className="text-red-500">{foodError}</p>}

        {!foodLoading && !foodError && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {foodItems.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/food/${item._id}`)}
                className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{item.category}</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-orange-600 font-semibold">
                      Swiggy ₹{item.swiggyPrice}
                    </span>
                    <span className="text-red-600 font-semibold">
                      Zomato ₹{item.zomatoPrice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {foodItems.length === 0 && (
              <p className="text-gray-500 col-span-full">
                No food items yet. Run the seed script on the backend:{" "}
                <code>npm run seed</code>
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
