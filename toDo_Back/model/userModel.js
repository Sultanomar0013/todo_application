// models/User.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
