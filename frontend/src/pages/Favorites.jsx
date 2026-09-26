// src/pages/Favorites.jsx
// ------------------------------------------------------------------
// Lists every food item the logged-in user has favorited. Protected
// by <ProtectedRoute> in App.jsx, so we can safely assume the user
// is logged in here.
// ------------------------------------------------------------------

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import FoodCard from "../components/FoodCard";
import Loader from "../components/Loader";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/favorites");
      setFavorites(data);
    } catch (err) {
      setError("Could not load your favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Your Favorites</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Food items you've saved for later.
      </p>

      {loading && <Loader />}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && favorites.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-3">You haven't favorited anything yet.</p>
          <Link to="/" className="text-brand font-medium">
            Browse restaurants →
          </Link>
        </div>
      )}

      {!loading && favorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((item) => (
            // Refresh the list after a heart is un-toggled, by re-fetching
            // whenever the FoodCard's favorite button is used here.
            <div key={item._id} onClick={() => setTimeout(fetchFavorites, 300)}>
              <FoodCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
