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
const widgetRoutes = require("./routes/Widget.route");
const feedbackRoutes = require("./routes/Feedback.route");
const testimonialWallRoutes = require("./routes/TestimonialWall.route");
const waitlistRoutes = require("./routes/waitlist.route");

app.use("/api/users", userRoutes);
app.use("/api/widgets", widgetRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/testimonial-walls", testimonialWallRoutes);
app.use("/api/waitlist", waitlistRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
