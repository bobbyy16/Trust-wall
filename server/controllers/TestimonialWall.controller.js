const crypto = require("crypto");
const TestimonialWall = require("../models/TestimonialWall.model");
const Widget = require("../models/Widget.model");
const Feedback = require("../models/Feedback.model");

// @desc Create testimonial wall
exports.createTestimonialWall = async (req, res) => {
  try {
    const { widgetId, feedbackIds } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (
      !widgetId ||
      !feedbackIds ||
      !Array.isArray(feedbackIds) ||
      feedbackIds.length === 0
    ) {
      return res.status(400).json({
        message: "Widget ID and feedback IDs are required",
      });
    }

    // Check if widget belongs to user
    const widget = await Widget.findOne({ _id: widgetId, userId });
    if (!widget) {
      return res.status(404).json({ message: "Widget not found" });
    }

    // Check if all feedback IDs belong to the widget and are approved
    const feedbacks = await Feedback.find({
      _id: { $in: feedbackIds },
      widgetId: widgetId,
      approved: true,
    });

    if (feedbacks.length !== feedbackIds.length) {
      return res.status(400).json({
        message: "Some feedback IDs are invalid or not approved",
      });
    }

    // Check if testimonial wall already exists for this widget
    const existingWall = await TestimonialWall.findOne({ widgetId });
    if (existingWall) {
      // Update existing testimonial wall
      existingWall.feedbackIds = feedbackIds;
      await existingWall.save();

      return res.status(200).json({
        message: "Testimonial wall updated successfully",
        testimonialWall: {
          id: existingWall._id,
          widgetId: existingWall.widgetId,
          embedId: existingWall.embedId,
          feedbackIds: existingWall.feedbackIds,
          embedUrl: `${process.env.FRONTEND_URL}/embed/testimonial/${existingWall.embedId}`,
          createdAt: existingWall.createdAt,
        },
      });
    }

    // Generate unique embed ID
    const embedId = crypto.randomBytes(16).toString("hex");

    // Create new testimonial wall
    const testimonialWall = new TestimonialWall({
      userId,
      widgetId,
      feedbackIds,
      embedId,
    });

    await testimonialWall.save();

    res.status(201).json({
      message: "Testimonial wall created successfully",
      testimonialWall: {
        id: testimonialWall._id,
        widgetId: testimonialWall.widgetId,
        embedId: testimonialWall.embedId,
        feedbackIds: testimonialWall.feedbackIds,
        embedUrl: `${process.env.FRONTEND_URL}/embed/testimonial/${testimonialWall.embedId}`,
        createdAt: testimonialWall.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get testimonial wall by widget
exports.getTestimonialWallByWidget = async (req, res) => {
  try {
    const { widgetId } = req.params;
    const userId = req.user.id;

    // Check if widget belongs to user
    const widget = await Widget.findOne({ _id: widgetId, userId });
    if (!widget) {
      return res.status(404).json({ message: "Widget not found" });
    }

    const testimonialWall = await TestimonialWall.findOne({
      widgetId,
    }).populate(
      "feedbackIds",
      "customerName customerImage rating message createdAt"
    );

    if (!testimonialWall) {
      return res.status(404).json({ message: "Testimonial wall not found" });
    }

    res.status(200).json({
      testimonialWall: {
        id: testimonialWall._id,
        widgetId: testimonialWall.widgetId,
        embedId: testimonialWall.embedId,
        embedUrl: `${process.env.FRONTEND_URL}/embed/testimonial/${testimonialWall.embedId}`,
        feedbacks: testimonialWall.feedbackIds.map((feedback) => ({
          id: feedback._id,
          customerName: feedback.customerName,
          customerImage: feedback.customerImage,
          rating: feedback.rating,
          message: feedback.message,
          createdAt: feedback.createdAt,
        })),
        createdAt: testimonialWall.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all testimonial walls for user
exports.getUserTestimonialWalls = async (req, res) => {
  try {
    const userId = req.user.id;

    const testimonialWalls = await TestimonialWall.find({ userId })
      .populate("widgetId", "name embedId")
      .populate("feedbackIds", "customerName rating")
      .sort({ createdAt: -1 });

    res.status(200).json({
      testimonialWalls: testimonialWalls.map((wall) => ({
        id: wall._id,
        embedId: wall.embedId,
        embedUrl: `${process.env.FRONTEND_URL}/embed/testimonial/${wall.embedId}`,
        widget: {
          id: wall.widgetId._id,
          name: wall.widgetId.name,
          embedId: wall.widgetId.embedId,
        },
        feedbackCount: wall.feedbackIds.length,
        averageRating:
          wall.feedbackIds.reduce((sum, feedback) => sum + feedback.rating, 0) /
            wall.feedbackIds.length || 0,
        createdAt: wall.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get testimonial wall for embedding (public route)
exports.getEmbedTestimonialWall = async (req, res) => {
  try {
    const { embedId } = req.params;

    const testimonialWall = await TestimonialWall.findOne({ embedId })
      .populate("widgetId", "name")
      .populate(
        "feedbackIds",
        "customerName customerImage rating message createdAt"
      );

    if (!testimonialWall) {
      return res.status(404).json({ message: "Testimonial wall not found" });
    }

    res.status(200).json({
      testimonialWall: {
        widget: {
          name: testimonialWall.widgetId.name,
        },
        feedbacks: testimonialWall.feedbackIds.map((feedback) => ({
          id: feedback._id,
          customerName: feedback.customerName,
          customerImage: feedback.customerImage,
          rating: feedback.rating,
          message: feedback.message,
          createdAt: feedback.createdAt,
        })),
        totalFeedbacks: testimonialWall.feedbackIds.length,
        averageRating:
          testimonialWall.feedbackIds.reduce(
            (sum, feedback) => sum + feedback.rating,
            0
          ) / testimonialWall.feedbackIds.length || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update testimonial wall
exports.updateTestimonialWall = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedbackIds } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (
      !feedbackIds ||
      !Array.isArray(feedbackIds) ||
      feedbackIds.length === 0
    ) {
      return res.status(400).json({
        message: "Feedback IDs are required",
      });
    }

    // Check if testimonial wall belongs to user
    const testimonialWall = await TestimonialWall.findOne({ _id: id, userId });
    if (!testimonialWall) {
      return res.status(404).json({ message: "Testimonial wall not found" });
    }

    // Check if all feedback IDs belong to the widget and are approved
    const feedbacks = await Feedback.find({
      _id: { $in: feedbackIds },
      widgetId: testimonialWall.widgetId,
      approved: true,
    });

    if (feedbacks.length !== feedbackIds.length) {
      return res.status(400).json({
        message: "Some feedback IDs are invalid or not approved",
      });
    }

    // Update testimonial wall
    testimonialWall.feedbackIds = feedbackIds;
    await testimonialWall.save();

    res.status(200).json({
      message: "Testimonial wall updated successfully",
      testimonialWall: {
        id: testimonialWall._id,
        widgetId: testimonialWall.widgetId,
        embedId: testimonialWall.embedId,
        feedbackIds: testimonialWall.feedbackIds,
        embedUrl: `${process.env.FRONTEND_URL}/embed/testimonial/${testimonialWall.embedId}`,
        createdAt: testimonialWall.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete testimonial wall
exports.deleteTestimonialWall = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const testimonialWall = await TestimonialWall.findOneAndDelete({
      _id: id,
      userId,
    });
    if (!testimonialWall) {
      return res.status(404).json({ message: "Testimonial wall not found" });
    }

    res.status(200).json({ message: "Testimonial wall deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get approved feedbacks for testimonial wall creation
exports.getApprovedFeedbacks = async (req, res) => {
  try {
    const { widgetId } = req.params;
    const userId = req.user.id;

    // Check if widget belongs to user
    const widget = await Widget.findOne({ _id: widgetId, userId });
    if (!widget) {
      return res.status(404).json({ message: "Widget not found" });
    }

    // Get approved feedbacks for the widget
    const approvedFeedbacks = await Feedback.find({
      widgetId: widgetId,
      approved: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      feedbacks: approvedFeedbacks.map((feedback) => ({
        id: feedback._id,
        customerName: feedback.customerName,
        customerImage: feedback.customerImage,
        rating: feedback.rating,
        message: feedback.message,
        createdAt: feedback.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
