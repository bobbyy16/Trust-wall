const express = require("express");
const router = express.Router();
const waitlistController = require("../controllers/Waitlist.controller.js");

// POST /api/waitlist - Join waitlist
router.post("/", waitlistController.joinWaitlist);

// GET /api/waitlist/stats - Get waitlist statistics
router.get("/stats", waitlistController.getWaitlistStats);

// GET /api/waitlist/position/:email - Check position by email
router.get("/position/:email", waitlistController.checkPosition);

module.exports = router;
