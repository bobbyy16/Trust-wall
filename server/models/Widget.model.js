const mongoose = require("mongoose");

const widgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  embedId: { type: String, required: true, unique: true }, // used for iframe/script
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Widget", widgetSchema);
