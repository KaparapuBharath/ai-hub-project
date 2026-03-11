import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Sliders, Settings, HelpCircle, LogOut } from "lucide-react";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="relative">

      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold"
      >
        KC
      </button>

      {/* Popup Menu */}
      {open && (
        <div className="absolute bottom-12 left-0 w-64 bg-[#1e1e1e] text-white rounded-xl shadow-xl p-3 space-y-2">

          {/* User Info */}
          <div className="pb-2 border-b border-gray-700">
            <p className="font-semibold">Kaparapu Bharath Chandra</p>
            <p className="text-sm text-gray-400">@bharath</p>
          </div>

          {/* Menu Items */}

          <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700">
            <Sparkles size={18} />
            Upgrade Plan
          </button>

          <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700">
            <Sliders size={18} />
            Personalization
          </button>

          <button
            onClick={() => navigate("/app/settings")}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700"
          >
            <Settings size={18} />
            Settings
          </button>

          <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700">
            <HelpCircle size={18} />
            Help
          </button>

          <hr className="border-gray-700" />

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-red-600 text-red-400 hover:text-white"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}