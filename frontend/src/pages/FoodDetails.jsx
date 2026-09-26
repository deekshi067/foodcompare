// src/pages/FoodDetails.jsx
// ------------------------------------------------------------------
// A focused, full-page view of a single food item's price
// comparison — this is the page users land on after clicking a
// FoodCard, and it's what gets shared/linked directly.
// ------------------------------------------------------------------

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import FavoriteButton from "../components/FavoriteButton";
import Loader from "../components/Loader";

function FoodDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/food/${id}`);
        setItem(data);
      } catch (err) {
        setError(err.response?.data?.message || "Food item not found");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/" className="text-brand font-medium">Go back home</Link>
      </div>
    );
  }

  const cheaper = item.cheaperPlatform;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid sm:grid-cols-2 gap-8">
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-64 sm:h-full object-cover rounded-xl"
          />
          <div className="absolute top-3 right-3">
            <FavoriteButton foodItemId={item._id} />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{item.name}</h1>
          {item.restaurant && (
            <Link
              to={`/restaurant/${item.restaurant._id}`}
              className="text-brand hover:underline"
            >
              {item.restaurant.name}
            </Link>
          )}
          <p className="text-gray-500 dark:text-gray-400 mt-2">{item.description}</p>
          <p className="text-sm mt-2">⭐ {item.rating?.toFixed(1)} · {item.category}</p>

          {/* Full price comparison */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div
              className={`rounded-xl p-4 border-2 text-center ${
                cheaper === "swiggy"
                  ? "border-swiggy bg-orange-50 dark:bg-orange-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <p className="font-semibold text-swiggy mb-1">Swiggy</p>
              <p className="text-2xl font-bold">₹{item.swiggyPrice}</p>
              {item.offers?.swiggy && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.offers.swiggy}</p>
              )}
              <a
                href={item.swiggyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 py-2 rounded-md bg-swiggy text-white text-sm hover:opacity-90"
              >
                Order Now
              </a>
            </div>

            <div
              className={`rounded-xl p-4 border-2 text-center ${
                cheaper === "zomato"
                  ? "border-zomato bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <p className="font-semibold text-zomato mb-1">Zomato</p>
              <p className="text-2xl font-bold">₹{item.zomatoPrice}</p>
              {item.offers?.zomato && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.offers.zomato}</p>
              )}
              <a
                href={item.zomatoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 py-2 rounded-md bg-zomato text-white text-sm hover:opacity-90"
              >
                Order Now
              </a>
            </div>
          </div>

          {cheaper !== "equal" && (
            <p className="text-center text-green-600 dark:text-green-400 font-medium mt-4">
              💰 You save ₹
              {Math.abs(item.swiggyPrice - item.zomatoPrice)} by ordering on{" "}
              {cheaper === "swiggy" ? "Swiggy" : "Zomato"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodDetails;
