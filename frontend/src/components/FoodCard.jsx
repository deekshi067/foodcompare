// src/components/FoodCard.jsx
// ------------------------------------------------------------------
// The core "price comparison" UI. Shows a food item's image, its
// Swiggy price vs Zomato price side by side (cheaper one highlighted),
// any offers, and two "Order Now" buttons that redirect the user to
// the real Swiggy/Zomato page in a new tab. We NEVER place the order
// ourselves — this app is a comparison tool only.
// ------------------------------------------------------------------

import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

function FoodCard({ item }) {
  const cheaper = item.cheaperPlatform; // "swiggy" | "zomato" | "equal" (from backend virtual)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      <div className="relative">
        <Link to={`/food/${item._id}`}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-40 object-cover"
            loading="lazy"
          />
        </Link>
        {/* Favorite (heart) toggle sits on top of the image */}
        <div className="absolute top-2 right-2">
          <FavoriteButton foodItemId={item._id} />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/food/${item._id}`} className="font-semibold hover:text-brand truncate">
          {item.name}
        </Link>
        {item.restaurant?.name && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {item.restaurant.name}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          ⭐ {item.rating?.toFixed(1) ?? "N/A"} · {item.category}
        </p>

        {/* --- Price comparison block --- */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div
            className={`rounded-lg p-2 text-center border-2 ${
              cheaper === "swiggy"
                ? "border-swiggy bg-orange-50 dark:bg-orange-900/20"
                : "border-transparent bg-gray-50 dark:bg-gray-700"
            }`}
          >
            <p className="text-xs font-medium text-swiggy">Swiggy</p>
            <p className="font-bold">₹{item.swiggyPrice}</p>
            {item.offers?.swiggy && (
              <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2">
                {item.offers.swiggy}
              </p>
            )}
          </div>

          <div
            className={`rounded-lg p-2 text-center border-2 ${
              cheaper === "zomato"
                ? "border-zomato bg-red-50 dark:bg-red-900/20"
                : "border-transparent bg-gray-50 dark:bg-gray-700"
            }`}
          >
            <p className="text-xs font-medium text-zomato">Zomato</p>
            <p className="font-bold">₹{item.zomatoPrice}</p>
            {item.offers?.zomato && (
              <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2">
                {item.offers.zomato}
              </p>
            )}
          </div>
        </div>

        {cheaper !== "equal" && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1 text-center font-medium">
            💰 Cheaper on {cheaper === "swiggy" ? "Swiggy" : "Zomato"}
          </p>
        )}

        {/* --- Order Now buttons: redirect to the real platform --- */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <a
            href={item.swiggyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-sm py-2 rounded-md bg-swiggy text-white hover:opacity-90 transition"
          >
            Order on Swiggy
          </a>
          <a
            href={item.zomatoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-sm py-2 rounded-md bg-zomato text-white hover:opacity-90 transition"
          >
            Order on Zomato
          </a>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
