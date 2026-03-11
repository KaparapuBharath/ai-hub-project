const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getUserUsage } = require("../controllers/usageController");

router.get("/", protect, getUserUsage);

module.exports = router;