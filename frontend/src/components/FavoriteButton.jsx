// src/components/FavoriteButton.jsx
// ------------------------------------------------------------------
// A small heart icon button that adds/removes a food item from the
// logged-in user's favorites list. If the visitor isn't logged in,
// clicking it sends them to the login page instead.
// ------------------------------------------------------------------

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function FavoriteButton({ foodItemId }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [busy, setBusy] = useState(false);

  // Check whether this item is already in the user's favorites list
  // (the list is stored as an array of food item IDs on the user object).
  useEffect(() => {
    if (user?.favorites) {
      const ids = user.favorites.map((f) => (typeof f === "string" ? f : f._id));
      setIsFavorite(ids.includes(foodItemId));
    }
  }, [user, foodItemId]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // stop the parent <Link> from navigating
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setBusy(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${foodItemId}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${foodItemId}`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Failed to update favorite:", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={busy}
      aria-label="Toggle favorite"
      className="h-8 w-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-900/80 shadow hover:scale-110 transition"
    >
      {isFavorite ? "❤️" : "🤍"}
    </button>
  );
}

export default FavoriteButton;
