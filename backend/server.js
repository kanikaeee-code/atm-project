
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");

// Load env variables
dotenv.config();

// Connect MongoDB
connectDB();

// Create app
const app = express();

// Middlewares
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("ATM Backend Running Successfully 🚀");
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});