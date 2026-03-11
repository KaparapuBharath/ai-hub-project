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

/* ================= CORS ================= */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* ================= STRIPE WEBHOOK (BEFORE JSON PARSER) ================= */
app.use(
  "/api/billing/webhook",
  express.raw({ type: "application/json" })
);

/* ================= JSON PARSER ================= */
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/billing", billingRoutes);

/* ================= FRONTEND (PRODUCTION) ================= */
const __dirnamePath = path.resolve();

app.use(
  express.static(path.join(__dirnamePath, "../../frontend/dist"))
);

/* React fallback route */
app.get(/.*/, (req, res) => {
  res.sendFile(
    path.join(__dirnamePath, "../../frontend/dist/index.html")
  );
});

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("AI Hub Backend Running 🚀");
});

/* ================= DATABASE & SERVER ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });