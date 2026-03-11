import { useEffect, useState } from "react";
import { Crown, BarChart3, Zap, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsage } from "../../services/usageService";
import useAuth from "../../context/useAuth";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    const fetchUsage = async () => {
      const data = await getUsage();
      setUsage(data);
    };
    fetchUsage();
  }, []);

  const used = usage?.totalRequests || 0;
  const limit = usage?.limit || 100;
  const remaining = limit - used;
  const plan = usage?.plan || "Free";

  const percentage = (used / limit) * 100;

  /* ================= DELETE ACCOUNT ================= */

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      await fetch("http://localhost:5000/api/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      logout();
      navigate("/login");

    } catch (err) {
      console.error("Delete account failed:", err);
    }
  };

  return (
    <div className="p-10 text-white max-w-6xl mx-auto space-y-10">

      {/* PROFILE CARD */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              {user?.name || "User"}
            </h2>
            <p className="text-gray-400">{user?.email}</p>

            <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-purple-600/30 text-purple-400 rounded-full">
              {plan} Plan
            </span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-[#0b1120]/70 p-6 rounded-3xl border border-white/10">
          <div className="flex justify-between mb-3">
            <span className="text-white/60 text-sm">Current Plan</span>
            <Crown className="text-yellow-400" />
          </div>
          <h3 className="text-2xl font-bold">{plan}</h3>
        </div>

        <div className="bg-[#0b1120]/70 p-6 rounded-3xl border border-white/10">
          <div className="flex justify-between mb-3">
            <span className="text-white/60 text-sm">Requests Used</span>
            <BarChart3 className="text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold">{used}</h3>
        </div>

        <div className="bg-[#0b1120]/70 p-6 rounded-3xl border border-white/10">
          <div className="flex justify-between mb-3">
            <span className="text-white/60 text-sm">Remaining</span>
            <Zap className="text-green-400" />
          </div>
          <h3 className="text-2xl font-bold">{remaining}</h3>
        </div>

        <div className="bg-[#0b1120]/70 p-6 rounded-3xl border border-white/10">
          <div className="flex justify-between mb-3">
            <span className="text-white/60 text-sm">Monthly Limit</span>
            <Rocket className="text-pink-400" />
          </div>
          <h3 className="text-2xl font-bold">{limit}</h3>
        </div>

      </div>

      {/* USAGE BAR */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Monthly Usage</h3>

        <div className="flex justify-between text-sm mb-2">
          <span>Usage</span>
          <span>{used} / {limit}</span>
        </div>

        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <button
          onClick={() => navigate("/app/billing")}
          className="mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl transition"
        >
          Upgrade Plan
        </button>
      </div>

      {/* ACCOUNT ACTIONS */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-semibold mb-6">Account Actions</h3>

        <div className="flex gap-4">
          <button
            onClick={logout}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-xl transition"
          >
            Logout
          </button>

          <button
            onClick={handleDeleteAccount}
            className="border border-red-500 text-red-400 hover:bg-red-900/40 px-6 py-2 rounded-xl transition"
          >
            Delete Account
          </button>
        </div>
      </div>

    </div>
  );
}

export default Profile;