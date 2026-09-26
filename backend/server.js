// server.js
// ------------------------------------------------------------------
// This is the ENTRY POINT of the backend. Running "node server.js"
// (or "npm run dev") starts this file, which:
//   1. Loads environment variables from .env
//   2. Connects to MongoDB
//   3. Sets up Express middleware (CORS, JSON body parsing)
//   4. Mounts every route file under its base URL
//   5. Starts listening for HTTP requests
// ------------------------------------------------------------------

require("dotenv").config(); // loads .env into process.env

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Route files
const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const foodItemRoutes = require("./routes/foodItemRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const adminRoutes = require("./routes/adminRoutes");

// 1. Connect to the database before anything else.
connectDB();

const app = express();

// 2. CORS: allows our React frontend (running on a different port)
//    to make requests to this API.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// 3. Lets Express automatically parse incoming JSON request bodies
//    into req.body (so req.body.email works in controllers).
app.use(express.json());

// Simple health-check route — useful to confirm the API is alive.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "FoodCompare API is running" });
});

// 4. Mount each route file under its base path.
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/food", foodItemRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler: catches any request to an undefined route.
app.use(notFound);
// Global error handler: formats all thrown/forwarded errors as JSON.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 FoodCompare API running on http://localhost:${PORT}`);
});
