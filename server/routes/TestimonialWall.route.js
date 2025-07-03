const express = require("express");
const router = express.Router();
const testimonialWallController = require("../controllers/TestimonialWall.controller");
const { protect } = require("../middleware/auth");

// Public route for embedding testimonial wall
router.get(
  "/embed/:embedId",
  testimonialWallController.getEmbedTestimonialWall
);

// Protected routes (require authentication)
router.post("/", protect, testimonialWallController.createTestimonialWall);
router.get("/", protect, testimonialWallController.getUserTestimonialWalls);
router.get(
  "/widget/:widgetId",
  protect,
  testimonialWallController.getTestimonialWallByWidget
);
router.get(
  "/approved-feedbacks/:widgetId",
  protect,
  testimonialWallController.getApprovedFeedbacks
);
router.put("/:id", protect, testimonialWallController.updateTestimonialWall);
router.delete("/:id", protect, testimonialWallController.deleteTestimonialWall);

module.exports = router;
