const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "student"], default: "student" },
  courses: [{ name: String, marks: Number }],
  attendance: [String],
  library: [String],
  totalFees: { type: Number, default: 0 },
  paidFees: { type: Number, default: 0 }
});
module.exports = mongoose.model("User", userSchema);
