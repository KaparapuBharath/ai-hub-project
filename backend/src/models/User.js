const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // ✅ Updated Subscription Plans
    plan: {
      type: String,
      enum: ["free", "go", "pro", "proPlus"],
      default: "free",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ✅ Usage Tracking
    usage: {
      type: Number,
      default: 0,
    },

    // ✅ Monthly Limit (auto updates when plan changes)
    monthlyLimit: {
      type: Number,
      default: 100,
    },

    stripeCustomerId: String,
    stripeSubscriptionId: String,

    subscriptionStatus: {
      type: String,
      enum: ["active", "canceled", "past_due", "none"],
      default: "none",
    },

    currentPeriodEnd: Date,
  },
  { timestamps: true }
);

/* 🔐 Hash Password */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* ✅ Auto Update Monthly Limit When Plan Changes */
userSchema.pre("save", function () {
  if (!this.isModified("plan")) return;

  switch (this.plan) {
    case "free":
      this.monthlyLimit = 100;
      break;
    case "go":
      this.monthlyLimit = 500;
      break;
    case "pro":
      this.monthlyLimit = 2000;
      break;
    case "proPlus":
      this.monthlyLimit = 10000;
      break;
  }
});

/* 🔐 Compare Password */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/* 📊 Increment Usage */
userSchema.methods.incrementUsage = async function () {
  this.usage += 1;
  await this.save();
};

/* 🔄 Reset Usage */
userSchema.methods.resetUsage = async function () {
  this.usage = 0;
  await this.save();
};

module.exports = mongoose.model("User", userSchema);