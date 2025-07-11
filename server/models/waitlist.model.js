const mongoose = require("mongoose");

const waitlistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    name: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      default: "website",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to set position
waitlistSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.position = count + 1;
  }
  next();
});

module.exports = mongoose.model("Waitlist", waitlistSchema);
