const router = require("express").Router();
const {
  register,
  login,
  logout,
  changePassword,
} = require("../controllers/authController");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

/* ================= AUTH ROUTES ================= */

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

/* ================= CHANGE PASSWORD ================= */

router.put("/change-password", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret123"
    );

    req.userId = decoded.id;

    return changePassword(req, res);
  } catch (err) {
    console.error("Change password error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
});

/* ================= GET CURRENT USER ================= */

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret123"
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("GET /me error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
});

/* ================= DELETE ACCOUNT ================= */

router.delete("/delete", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret123"
    );

    await User.findByIdAndDelete(decoded.id);

    return res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err.message);
    return res.status(500).json({ message: "Failed to delete account" });
  }
});

module.exports = router;