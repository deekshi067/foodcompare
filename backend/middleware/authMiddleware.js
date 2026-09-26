// middleware/authMiddleware.js
// ------------------------------------------------------------------
// Middleware = a function that runs BETWEEN the incoming request and
// your route handler. We use it here to check "is this person
// logged in?" and "is this person an admin?" before letting them
// access protected routes.
// ------------------------------------------------------------------

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ------------------------------------------------------------------
// protect: verifies the JWT token sent by the frontend.
// Expected header format:  Authorization: Bearer <token>
// ------------------------------------------------------------------
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      // "Bearer abc123token" -> split on space -> take the token part
      token = authHeader.split(" ")[1];

      // Verify the token's signature & expiry using our secret key.
      // If invalid/expired, this throws an error (caught below).
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the logged-in user (minus password) to req.user so
      // every route handler after this middleware can access it.
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      next(); // move on to the actual route handler
    } catch (error) {
      console.error("Auth error:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// ------------------------------------------------------------------
// adminOnly: must be used AFTER "protect". Blocks non-admins.
// ------------------------------------------------------------------
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { protect, adminOnly };
