const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/Feedback.controller");
const { protect } = require("../middleware/auth");

// Public route for submitting feedback (no authentication required)
router.post("/submit/:embedId", feedbackController.submitFeedback);

// Protected routes (require authentication)
router.get("/", protect, feedbackController.getUserFeedbacks);
router.get("/widget/:widgetId", protect, feedbackController.getWidgetFeedbacks);
router.get("/:id", protect, feedbackController.getFeedback);
router.patch(
  "/:id/approval",
  protect,
  feedbackController.updateFeedbackApproval
);
router.delete("/:id", protect, feedbackController.deleteFeedback);

module.exports = router;
