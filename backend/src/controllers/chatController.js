const Conversation = require("../models/Conversation");
const User = require("../models/User");

// POST /api/chat
exports.chatWithAI = async (req, res) => {
  try {
    const user = req.user;
    const { messages, conversationId } = req.body;

    // 🔒 Enforce monthly usage limit
    if (user.usage >= user.monthlyLimit) {
      return res.status(403).json({
        message: "Monthly limit reached. Upgrade your plan.",
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        message: "Messages array is required.",
      });
    }

    const lastMessage = messages[messages.length - 1]?.content || "";

    // 🤖 Replace this later with real Ollama/OpenAI call
    const aiReply = `You said: ${lastMessage}`;

    let conversation;

    // 🔁 If conversation exists → update
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        user: user._id,
      });

      if (!conversation) {
        return res.status(404).json({
          message: "Conversation not found.",
        });
      }

      conversation.messages = [
        ...messages,
        { role: "assistant", content: aiReply },
      ];

      conversation.updatedAt = new Date();
    } 
    // 🆕 If no conversation → create new
    else {
      conversation = new Conversation({
        user: user._id,
        title: lastMessage.substring(0, 30) || "New Chat",
        messages: [
          ...messages,
          { role: "assistant", content: aiReply },
        ],
      });
    }

    await conversation.save();

    // 📊 Increment usage safely
    await user.incrementUsage();

    res.json({
      message: {
        role: "assistant",
        content: aiReply,
      },
      conversationId: conversation._id,
    });

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};