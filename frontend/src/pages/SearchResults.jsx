// src/pages/SearchResults.jsx
// ------------------------------------------------------------------
// Reads "q" (search text) and "category" from the URL query string,
// fetches matching food items AND matching restaurants, and lets the
// user filter by category / sort by price or rating.
// ------------------------------------------------------------------

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import FoodCard from "../components/FoodCard";
import RestaurantCard from "../components/RestaurantCard";
import Loader from "../components/Loader";

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const [foodItems, setFoodItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch the full category list once, used to render filter chips.
  useEffect(() => {
    api.get("/food/categories").then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  // Re-fetch results whenever the search text, category, or sort changes.
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const foodRes= await 
          api.get("/food",{
            params:{
              search: q,category:category,sortBy:sortBy,}
            });
          
          console.log("FOOD DATA:",foodRes.data);
          setFoodItems(
            Array.isArray(foodRes.data)
            ? foodRes.data: foodRes.data.data || []
          );
           const restaurantRes = await 
          api.get("/resstaurants",{
            params:{
              search: q,category:category,
            },
            });
          
          setRestaurants(
         Array.isArray(restaurantRes.data)
            ? restaurantRes.data: restaurantRes.data.data || []
          );
      
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [q, category, sortBy]);

  const setCategoryFilter = (cat) => {
    const params = {};
    if (q) params.q = q;
    if (cat) params.category = cat;
    setSearchParams(params);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">
        {q ? `Results for "${q}"` : category ? `${category}` : "All Food Items"}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {foodItems.length} food item(s) · {restaurants.length} restaurant(s)
      </p>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter("")}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              !category
                ? "bg-brand text-white border-brand"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                category === c
                  ? "bg-brand text-white border-brand"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
        >
          <option value="">Sort: Relevance</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
          <option value="ratingHighToLow">Rating: High to Low</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {restaurants.length > 0 && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold mb-3">Restaurants</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {restaurants.map((r) => (
                  <RestaurantCard key={r._id} restaurant={r} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-semibold mb-3">Food Items</h2>
            {foodItems.length === 0 ? (
              <p className="text-gray-500">No food items match your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {foodItems.map((item) => (
                  <FoodCard key={item._id} item={item} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default SearchResults;
