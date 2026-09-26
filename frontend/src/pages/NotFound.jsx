// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-brand mb-4">404</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="text-brand font-medium">
        ← Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
