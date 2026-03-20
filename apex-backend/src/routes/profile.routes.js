const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/requireAuth");
const {
  getProfile,
  updateProfile,
  deleteAccount,
} = require("../controllers/profile.controller");

// All profile routes require the user to be logged in
router.get("/profile", requireAuth, getProfile);
router.patch("/profile", requireAuth, updateProfile);
router.delete("/profile", requireAuth, deleteAccount);

module.exports = router;