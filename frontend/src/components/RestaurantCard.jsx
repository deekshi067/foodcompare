// src/components/RestaurantCard.jsx
// ------------------------------------------------------------------
// A clickable card used on the Home page and Search Results page.
// Clicking anywhere on the card navigates to that restaurant's
// details page (/restaurant/:id).
// ------------------------------------------------------------------

import { Link } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="block bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition overflow-hidden"
    >
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-full h-40 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{restaurant.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {restaurant.address}
        </p>
        <div className="flex items-center justify-between mt-2 text-sm">
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
            ⭐ {restaurant.rating?.toFixed(1) ?? "N/A"}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            🕒 {restaurant.deliveryTime}
          </span>
        </div>
        {restaurant.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {restaurant.categories.slice(0, 3).map((c) => (
              <span
                key={c}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default RestaurantCard;
