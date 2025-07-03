const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  widgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Widget",
    required: true,
  },
  customerName: { type: String, required: true },
  customerImage: { type: String }, // optional image URL
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  approved: { type: Boolean, default: false }, // for testimonial wall
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
