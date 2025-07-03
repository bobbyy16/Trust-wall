const mongoose = require("mongoose");

const testimonialWallSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  widgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Widget",
    required: true,
  },
  feedbackIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }],
  embedId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TestimonialWall", testimonialWallSchema);
