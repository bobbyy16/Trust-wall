const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  paymentGateway: {
    type: String,
    enum: ["stripe", "razorpay"],
    required: true,
  },
  transactionId: { type: String, required: true },
  plan: { type: String, enum: ["pro", "premium"], required: true },
  status: { type: String, enum: ["success", "failed"], default: "success" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
