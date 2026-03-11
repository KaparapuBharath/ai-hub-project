const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * Helper: Generate JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan || "free",
      role: user.role || "user",
    },
    process.env.JWT_SECRET || "secret123",
    { expiresIn: "7d" }
  );
};

/**
 * Register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      plan: "free",
      role: "user",
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid credentials" });

    const match = await user.matchPassword(password);
    if (!match)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Logout
 */
exports.logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};

/**
 * Change Password
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId; // ✅ fixed
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = password;
    await user.save();

    res.json({
       message: "Password updated successfully",
       logout: true
    });

  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: err.message });
  }
};