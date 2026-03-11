const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/", protect, async (req, res) => {
  try {
    const { messages } = req.body;
    const user = req.user;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    if (user.usage >= user.monthlyLimit) {
      return res.status(403).json({
        message: "Monthly limit reached. Upgrade your plan.",
      });
    }

    // 🔧 Remove unsupported fields like "time"
    const cleanMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: cleanMessages,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    console.log("Groq Response:", data);

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({
        error: "AI response invalid",
        details: data,
      });
    }

    const aiReply = data.choices[0].message.content;

    await user.incrementUsage();

    res.json({
      message: {
        role: "assistant",
        content: aiReply,
      },
    });

  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: "AI server error" });
  }
});

module.exports = router;