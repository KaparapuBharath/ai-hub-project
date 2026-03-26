const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const usageRoutes = require("./routes/usageRoutes");
const billingRoutes = require("./routes/billingRoutes");
const chatRoutes = require("./routes/chatRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

const app = express();

/* ================= FORCE CORS (FINAL FIX) ================= */
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://ai-hub-project-production.up.railway.app"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* ================= CORS ================= */
app.use(
  cors({
    origin: [
      "https://ai-hub-project-production.up.railway.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* ================= STRIPE WEBHOOK ================= */
app.use(
  "/api/billing/webhook",
  express.raw({ type: "application/json" })
);

/* ================= JSON PARSER ================= */
app.use(express.json());

/* ================= FIX DOUBLE /api BUG ================= */
app.use((req, res, next) => {
  if (req.url.startsWith("/api/api")) {
    req.url = req.url.replace("/api/api", "/api");
  }
  next();
});

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/billing", billingRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/health", (req, res) => {
  res.send("AI Hub Backend Running 🚀");
});

/* ================= FRONTEND ================= */
const __dirnamePath = path.resolve();

app.use(express.static(path.join(__dirnamePath, "frontend/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirnamePath, "frontend/dist/index.html"));
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({
    message: "Server Error",
    error: err.message,
  });
});

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });