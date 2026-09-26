// src/pages/RestaurantDetails.jsx
// ------------------------------------------------------------------
// Shows one restaurant's info plus every food item it offers, each
// with the Swiggy vs Zomato comparison via <FoodCard>.
// ------------------------------------------------------------------

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import FoodCard from "../components/FoodCard";
import Loader from "../components/Loader";

function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/restaurants/${id}`);
        setRestaurant(data.restaurant);
        setFoodItems(data.foodItems);
      } catch (err) {
        setError(err.response?.data?.message || "Restaurant not found");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  return (
    <div>
      {/* Restaurant header/banner */}
      <div className="relative h-56 sm:h-72">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="max-w-6xl mx-auto px-4 py-6 text-white w-full">
            <h1 className="text-2xl sm:text-3xl font-bold">{restaurant.name}</h1>
            <p className="text-white/90">{restaurant.address}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span>⭐ {restaurant.rating?.toFixed(1)}</span>
              <span>🕒 {restaurant.deliveryTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Menu — Compare Prices</h2>
        {foodItems.length === 0 ? (
          <p className="text-gray-500">No food items listed for this restaurant yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {foodItems.map((item) => (
              <FoodCard key={item._id} item={{ ...item, restaurant }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantDetails;
