const express = require("express");
const connectDB = require("./config/database");
// Load environment variables from .env file
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
// Middleware to parse JSON bodies

app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to the Trust Wall API");
});

const userRoutes = require("./routes/User.route");
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
