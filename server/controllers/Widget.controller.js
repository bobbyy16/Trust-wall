const crypto = require("crypto");
const Widget = require("../models/Widget.model");
const User = require("../models/User.model");

// @desc Create a new widget
exports.createWidget = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    // Check user's plan limits
    const user = await User.findById(userId);
    const planLimits = {
      free: 1,
      pro: 5,
      premium: 20,
    };

    if (user.widgetCount >= planLimits[user.plan]) {
      return res.status(400).json({
        message: `Widget limit reached for ${user.plan} plan. Upgrade to create more widgets.`,
      });
    }

    // Generate unique embed ID
    const embedId = crypto.randomBytes(16).toString("hex");

    const widget = new Widget({
      userId,
      name,
      embedId,
    });

    await widget.save();

    // Update user's widget count
    user.widgetCount += 1;
    await user.save();

    res.status(201).json({
      message: "Widget created successfully",
      widget: {
        id: widget._id,
        name: widget.name,
        embedId: widget.embedId,
        createdAt: widget.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all widgets for a user
exports.getWidgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const widgets = await Widget.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      widgets: widgets.map((widget) => ({
        id: widget._id,
        name: widget.name,
        embedId: widget.embedId,
        createdAt: widget.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single widget
exports.getWidget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const widget = await Widget.findOne({ _id: id, userId });
    if (!widget) {
      return res.status(404).json({ message: "Widget not found" });
    }

    res.status(200).json({
      widget: {
        id: widget._id,
        name: widget.name,
        embedId: widget.embedId,
        createdAt: widget.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update widget
exports.updateWidget = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    const widget = await Widget.findOneAndUpdate(
      { _id: id, userId },
      { name },
      { new: true }
    );

    if (!widget) {
      return res.status(404).json({ message: "Widget not found" });
    }

    res.status(200).json({
      message: "Widget updated successfully",
      widget: {
        id: widget._id,
        name: widget.name,
        embedId: widget.embedId,
        createdAt: widget.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete widget
exports.deleteWidget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const widget = await Widget.findOneAndDelete({ _id: id, userId });
    if (!widget) {
      return res.status(404).json({ message: "Widget not found" });
    }

    // Update user's widget count
    const user = await User.findById(userId);
    user.widgetCount = Math.max(0, user.widgetCount - 1);
    await user.save();

    res.status(200).json({ message: "Widget deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get widget form by embed ID (public route)
exports.getWidgetForm = async (req, res) => {
  try {
    const { embedId } = req.params;

    const widget = await Widget.findOne({ embedId });
    if (!widget) {
      return res.status(404).json({ message: "Widget not found" });
    }

    res.status(200).json({
      widget: {
        id: widget._id,
        name: widget.name,
        embedId: widget.embedId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
