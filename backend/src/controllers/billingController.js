const Stripe = require("stripe");
const User = require("../models/User");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;

    const prices = {
      go: 900,        // $9
      pro: 2900,      // $29
      proPlus: 7900,  // $79
    };

    if (!prices[plan]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.toUpperCase() + " Plan",
            },
            unit_amount: prices[plan],
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/app/billing?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/app/billing?canceled=true`,
      metadata: {
        userId: req.user.id,
        plan,
      },
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Stripe session failed" });
  }
};
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const plan = session.metadata.plan;

    await User.findByIdAndUpdate(userId, { plan });

    console.log("User upgraded to:", plan);
  }

  res.json({ received: true });
};