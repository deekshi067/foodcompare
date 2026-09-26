// src/components/Navbar.jsx
// ------------------------------------------------------------------
// Top navigation bar, present on every page. Shows different links
// depending on whether the user is logged in / an admin, and
// includes a quick search box + the dark mode toggle button.
// ------------------------------------------------------------------

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-brand shrink-0">
          🍽️ FoodCompare
        </Link>

        {/* Search bar — hidden on very small screens to save space */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex flex-1 max-w-md"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food or restaurants..."
            className="w-full px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            type="submit"
            className="px-4 rounded-r-md bg-brand text-white hover:bg-brand-dark transition"
          >
            Search
          </button>
        </form>

        <div className="ml-auto flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-3 text-sm">
            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="hover:text-brand">
                  ❤️ Favorites
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-brand">
                    ⚙️ Admin
                  </Link>
                )}
                <Link to="/profile" className="hover:text-brand">
                  👤 {user?.name?.split(" ")[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-md bg-brand text-white hover:bg-brand-dark"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2 text-sm border-t border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSearch} className="flex mt-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search food or restaurants..."
              className="w-full px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            />
            <button type="submit" className="px-4 rounded-r-md bg-brand text-white">
              Go
            </button>
          </form>

          {isAuthenticated ? (
            <>
              <Link to="/favorites" onClick={() => setMenuOpen(false)}>❤️ Favorites</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>⚙️ Admin</Link>}
              <Link to="/profile" onClick={() => setMenuOpen(false)}>👤 Profile</Link>
              <button onClick={handleLogout} className="text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
