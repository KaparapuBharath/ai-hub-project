import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

function Billing() {
  const { login } = useContext(AuthContext);
  const [currentPlan, setCurrentPlan] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /* ================= FETCH PLAN ================= */
  const fetchPlan = async () => {
    try {
      const res = await api.get("/billing/subscription");
      setCurrentPlan(res.data.plan);
    } catch (error) {
      console.log("Subscription fetch skipped");
    }
  };

  /* ================= REFRESH USER ================= */
  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      login(res.data);
    } catch (err) {
      console.log("User refresh skipped");
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchPlan();
  }, []);

  /* ================= STRIPE RETURN HANDLING ================= */
  useEffect(() => {
    if (searchParams.get("success")) {
      setShowSuccess(true);
      refreshUser();
      fetchPlan();
      navigate("/app/billing", { replace: true });
    }

    if (searchParams.get("canceled")) {
      setShowCancel(true);
      navigate("/app/billing", { replace: true });
    }
  }, [searchParams, navigate]);

  /* ================= UPGRADE ================= */
  const upgrade = async (plan) => {
    try {
      setLoadingPlan(plan);
      const res = await api.post("/billing/checkout", { plan });
      window.location.href = res.data.url;
    } catch (error) {
      console.error("Checkout failed");
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      name: "go",
      price: 9,
      features: ["500 requests/month", "GPT-3.5 access", "Email support"],
    },
    {
      name: "pro",
      price: 29,
      features: ["2000 requests/month", "All AI models", "Priority support"],
    },
    {
      name: "proPlus",
      price: 79,
      features: ["10000 requests/month", "Unlimited history", "Fastest routing"],
    },
  ];

  return (
    <div className="p-10 text-white">

      {showSuccess && (
        <div className="bg-green-600 p-3 rounded mb-4">
          🎉 Payment successful! Your plan has been upgraded.
        </div>
      )}

      {showCancel && (
        <div className="bg-red-600 p-3 rounded mb-4">
          ❌ Payment was canceled.
        </div>
      )}

      <p className="mb-6 text-lg">
        Current Plan:{" "}
        <span className="font-bold capitalize">{currentPlan}</span>
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-6 rounded-2xl border ${
              currentPlan === plan.name
                ? "border-green-500 bg-gray-800"
                : "border-gray-700 bg-gray-900"
            }`}
          >
            <h2 className="text-xl font-semibold capitalize mb-4">
              {plan.name}
            </h2>

            <p className="text-4xl font-bold mb-4">
              ${plan.price}
              <span className="text-sm font-normal"> /month</span>
            </p>

            <ul className="mb-6 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i}>• {feature}</li>
              ))}
            </ul>

            {currentPlan === plan.name ? (
              <button
                disabled
                className="w-full bg-green-600 py-2 rounded-xl cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => upgrade(plan.name)}
                disabled={loadingPlan === plan.name}
                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-xl"
              >
                {loadingPlan === plan.name
                  ? "Redirecting..."
                  : "Upgrade"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Billing;