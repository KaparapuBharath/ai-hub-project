const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/", protect, async (req, res) => {
  try {
    const { messages } = req.body;

    const user = req.user;

    // 🔒 Enforce monthly limit
    if (user.usage >= user.monthlyLimit) {
      return res.status(403).json({
        message: "Monthly limit reached. Upgrade your plan.",
      });
    }

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemma3:1b",
        messages,
        stream: false,
      }),
    });

    const data = await response.json();

    // 📊 Increment usage AFTER successful AI response
    await user.incrementUsage();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ollama not responding" });
  }
});

module.exports = router;