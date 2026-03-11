const User = require("../models/User");

exports.getUserUsage = async (req, res) => {
  try {
    const user = req.user; // Already attached by middleware

    res.json({
      plan: user.plan || "free",
      totalRequests: user.requestCount || 0,
      limit: user.plan === "pro" ? 1000 : 100,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};