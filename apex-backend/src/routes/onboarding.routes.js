const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/requireAuth");
const {
  saveBodyMetrics,
  saveFitnessGoals,
  saveActivityLevel,
  saveDietaryPreference,
} = require("../controllers/onboarding.controller");

// All onboarding routes require the user to be logged in
router.post("/body-metrics", requireAuth, saveBodyMetrics);
router.post("/fitness-goals", requireAuth, saveFitnessGoals);
router.post("/activity-level", requireAuth, saveActivityLevel);
router.post("/dietary-preference", requireAuth, saveDietaryPreference);

module.exports = router;