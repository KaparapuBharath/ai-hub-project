const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  const conversations = await Conversation.find({
    user: req.user._id,
  }).sort({ updatedAt: -1 });

  res.json(conversations);
});

module.exports = router;