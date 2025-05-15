const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/student");

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.options("*", cors());
app.use(express.json());



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));
app.use(express.json());
app.use("/", authRoutes);
app.use("/student", studentRoutes); // Keep as is


const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));