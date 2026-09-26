// config/db.js
// ------------------------------------------------------------------
// This file is responsible for ONE thing: connecting to MongoDB.
// We keep it separate from server.js so the connection logic is
// reusable and easy to find.
// ------------------------------------------------------------------

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.connect() returns a Promise, so we "await" it.
    // process.env.MONGO_URI comes from our .env file (loaded in server.js).
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If the DB connection fails, there's no point running the server.
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit the Node process with a failure code.
  }
};

module.exports = connectDB;
