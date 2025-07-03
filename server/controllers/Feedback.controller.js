const Feedback = require("../models/Feedback.model");
const Widget = require("../models/Widget.model");
const User = require("../models/User.model");

// @desc Submit feedback (public route)
exports.submitFeedback = async (req, res) => {
  try {
    const { embedId } = req.params;
    const { customerName, customerImage, rating, message } = req.body;

    // Validate required fields
    if (!customerName || !rating || !message) {
      return res.status(400).json({
        message: "Customer name, rating, and message are required",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if widget exists
    const widget = await Widget.findOne({ embedId });
    if (!widget) {
      return res.status(404).json({ message: "Widget not found" });
    }

    // Check user's plan limits
    const user = await User.findById(widget.userId);
    const planLimits = {
      free: 10,
      pro: 100,
      premium: 1000,
    };

    if (user.feedbackCount >= planLimits[user.plan]) {
      return res.status(400).json({
        message: "Feedback limit reached for this widget's plan",
      });
    }

    // Create feedback
    const feedback = new Feedback({
      widgetId: widget._id,
      customerName,
      customerImage: customerImage || null,
      rating,
      message,
    });

    await feedback.save();

    // Update user's feedback count
    user.feedbackCount += 1;
    await user.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: {
        id: feedback._id,
        customerName: feedback.customerName,
        rating: feedback.rating,
        message: feedback.message,
        createdAt: feedback.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all feedbacks for a widget
exports.getWidgetFeedbacks = async (req, res) => {
  try {
    const { widgetId } = req.params;
    const userId = req.user.id;

    // Check if widget belongs to user
    const widget = await Widget.findOne({ _id: widgetId, userId });
    if (!widget) {
      return res.status(404).json({ message: "Widget not found" });
    }

    // Get feedbacks with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find({ widgetId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalFeedbacks = await Feedback.countDocuments({ widgetId });

    res.status(200).json({
      feedbacks: feedbacks.map((feedback) => ({
        id: feedback._id,
        customerName: feedback.customerName,
        customerImage: feedback.customerImage,
        rating: feedback.rating,
        message: feedback.message,
        approved: feedback.approved,
        createdAt: feedback.createdAt,
      })),
      pagination: {
        page,
        limit,
        totalFeedbacks,
        totalPages: Math.ceil(totalFeedbacks / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all feedbacks for user's widgets
exports.getUserFeedbacks = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all user's widgets
    const widgets = await Widget.find({ userId });
    const widgetIds = widgets.map((widget) => widget._id);

    // Get feedbacks with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find({ widgetId: { $in: widgetIds } })
      .populate("widgetId", "name embedId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalFeedbacks = await Feedback.countDocuments({
      widgetId: { $in: widgetIds },
    });

    res.status(200).json({
      feedbacks: feedbacks.map((feedback) => ({
        id: feedback._id,
        customerName: feedback.customerName,
        customerImage: feedback.customerImage,
        rating: feedback.rating,
        message: feedback.message,
        approved: feedback.approved,
        createdAt: feedback.createdAt,
        widget: {
          id: feedback.widgetId._id,
          name: feedback.widgetId.name,
          embedId: feedback.widgetId.embedId,
        },
      })),
      pagination: {
        page,
        limit,
        totalFeedbacks,
        totalPages: Math.ceil(totalFeedbacks / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single feedback
exports.getFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const feedback = await Feedback.findById(id).populate(
      "widgetId",
      "name embedId userId"
    );
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Check if feedback's widget belongs to user
    if (feedback.widgetId.userId.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({
      feedback: {
        id: feedback._id,
        customerName: feedback.customerName,
        customerImage: feedback.customerImage,
        rating: feedback.rating,
        message: feedback.message,
        approved: feedback.approved,
        createdAt: feedback.createdAt,
        widget: {
          id: feedback.widgetId._id,
          name: feedback.widgetId.name,
          embedId: feedback.widgetId.embedId,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update feedback approval status
exports.updateFeedbackApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    const userId = req.user.id;

    const feedback = await Feedback.findById(id).populate("widgetId", "userId");
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Check if feedback's widget belongs to user
    if (feedback.widgetId.userId.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    feedback.approved = approved;
    await feedback.save();

    res.status(200).json({
      message: "Feedback approval status updated",
      feedback: {
        id: feedback._id,
        approved: feedback.approved,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const feedback = await Feedback.findById(id).populate("widgetId", "userId");
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Check if feedback's widget belongs to user
    if (feedback.widgetId.userId.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Feedback.findByIdAndDelete(id);

    // Update user's feedback count
    const user = await User.findById(userId);
    user.feedbackCount = Math.max(0, user.feedbackCount - 1);
    await user.save();

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
