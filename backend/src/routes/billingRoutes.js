const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* ================= AUTH MIDDLEWARE ================= */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

/* ===================================================== */
/* 🚨 IMPORTANT: WEBHOOK MUST BE FIRST & USE RAW BODY  */
/* ===================================================== */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    /* ===== Handle Successful Checkout ===== */
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        try {
          const user = await User.findById(userId);

          if (user) {
            user.plan = plan;
            user.subscriptionStatus = "active";
            await user.save();

            console.log(`✅ User ${user.email} upgraded to ${plan}`);
          }
        } catch (dbError) {
          console.error("Database update failed:", dbError.message);
        }
      }
    }

    res.json({ received: true });
  }
);

/* ===================================================== */
/* ✅ ENABLE JSON AFTER WEBHOOK (VERY IMPORTANT)        */
/* ===================================================== */
router.use(express.json());

/* ================= GET SUBSCRIPTION ================= */
router.get("/subscription", protect, async (req, res) => {
  try {
    res.json({
      plan: req.user.plan,
      status: req.user.subscriptionStatus,
      monthlyLimit: req.user.monthlyLimit,
      usage: req.user.usage,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subscription" });
  }
});

/* ================= CREATE CHECKOUT ================= */
router.post("/checkout", protect, async (req, res) => {
  try {
    const { plan } = req.body;

    const priceMap = {
      go: process.env.STRIPE_GO_PRICE_ID,
      pro: process.env.STRIPE_PRO_PRICE_ID,
      proPlus: process.env.STRIPE_PROPLUS_PRICE_ID,
    };

    const selectedPrice = priceMap[plan];

    if (!selectedPrice) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: req.user.email,
      line_items: [
        {
          price: selectedPrice,
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.user._id.toString(),
        plan,
      },
      success_url: `${process.env.CLIENT_URL}/app/billing?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/app/billing?canceled=true`,
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    res.status(500).json({ message: "Checkout session failed" });
  }
});

module.exports = router;