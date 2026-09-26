// models/User.js
// ------------------------------------------------------------------
// Defines the "User" collection in MongoDB.
// A Mongoose "Schema" is basically a blueprint that describes what
// fields a document has, their types, and validation rules.
// ------------------------------------------------------------------

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // removes extra whitespace from start/end
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two users can share an email
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // by default, don't return password in queries
    },
    role: {
      type: String,
      enum: ["user", "admin"], // only these two values are allowed
      default: "user",
    },
    // An array of references to FoodItem documents the user has "favorited".
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItem",
      },
    ],
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt fields
  }
);

// ------------------------------------------------------------------
// MONGOOSE MIDDLEWARE ("pre save hook")
// This function runs automatically right BEFORE a user document is
// saved to the database. We use it to hash the plain-text password
// so we never store readable passwords in MongoDB.
// ------------------------------------------------------------------
userSchema.pre("save", async function (next) {
  // "this" refers to the user document being saved.
  // Only re-hash the password if it was actually changed/created.
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10); // "10" = hashing complexity/rounds
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ------------------------------------------------------------------
// INSTANCE METHOD
// Adds a custom method to every user document so we can easily
// compare a plain-text login password against the hashed one stored
// in the database. Used in the login controller.
// ------------------------------------------------------------------
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
