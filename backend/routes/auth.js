const express = require("express");
const router = express.Router();
const User = require("../models/User");
const cors = require("cors");

// Apply CORS middleware just to this router
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
};
router.use(cors(corsOptions));

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: "Signup failed", details: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;