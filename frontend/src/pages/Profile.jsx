// src/pages/Profile.jsx
// ------------------------------------------------------------------
// Simple read-only profile page showing the logged-in user's info
// and a summary of their favorites count.
// ------------------------------------------------------------------

import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Profile() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
        <div className="h-20 w-20 rounded-full bg-brand text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-xl font-bold">{user?.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>

        <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand">
          {isAdmin ? "Administrator" : "Member"}
        </span>

        <div className="mt-6 grid grid-cols-1 gap-2">
          <Link
            to="/favorites"
            className="py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            ❤️ View Favorites
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              ⚙️ Go to Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
