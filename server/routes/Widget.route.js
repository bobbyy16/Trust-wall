const express = require("express");
const router = express.Router();
const widgetController = require("../controllers/Widget.controller");
const { protect } = require("../middleware/auth");

// Protected routes (require authentication)
router.post("/", protect, widgetController.createWidget);
router.get("/", protect, widgetController.getWidgets);
router.get("/:id", protect, widgetController.getWidget);
router.put("/:id", protect, widgetController.updateWidget);
router.delete("/:id", protect, widgetController.deleteWidget);

// Public route for widget form (no authentication required)
router.get("/form/:embedId", widgetController.getWidgetForm);

module.exports = router;
