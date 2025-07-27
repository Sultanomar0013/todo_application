// models/Task.js

const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending"
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },
  userId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
