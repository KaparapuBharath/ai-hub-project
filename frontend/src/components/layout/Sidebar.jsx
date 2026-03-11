import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useAuth from "../../context/useAuth";
import brainLogo from "../../assets/brain.png";

import {
  LayoutDashboard,
  MessageSquare,
  CreditCard,
  User,
  Settings
} from "lucide-react";

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200";

  const activeClass =
    "bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-400";

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/app/chat", label: "Workspace", icon: MessageSquare },
    { to: "/app/billing", label: "Billing", icon: CreditCard },
    { to: "/app/profile", label: "Account Details", icon: User },
    { to: "/app/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col p-3">

      {/* Logo */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="h-16 mb-6 cursor-pointer flex items-center px-0"
      >
        {/* fixed container for icon */}
        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
          <img
            src={brainLogo}
            alt="AI HUB"
            className="w-20 h-20 object-contain"
          />
        </div>

        <span
          className={`ml-3 whitespace-nowrap text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent transition-all duration-300 ${
            collapsed
              ? "opacity-0 translate-x-[-10px]"
              : "opacity-100 translate-x-0"
          }`}
        >
          AI HUB
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive ? activeClass : "hover:bg-white/10"
                } ${collapsed ? "justify-center" : ""}`
              }
            >

              {/* FIX: Icon container keeps same size */}
              <div className="w-8 flex justify-center">
                <Icon size={18} className="opacity-80" />
              </div>

              <span
                className={`font-medium whitespace-nowrap transition-all duration-300 ${
                  collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 ml-2"
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div
        className="relative mt-auto border-t border-white/10 pt-4"
        ref={menuRef}
      >
        <div
          onClick={() => {
            if (collapsed) {
              navigate("/app/profile");
            } else {
              setMenuOpen(!menuOpen);
            }
          }}
          className={`cursor-pointer hover:bg-white/5 rounded-xl p-3 transition ${
            collapsed ? "flex justify-center" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>

            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  {user?.name || "User"}
                </span>
                <span className="text-xs text-white/60 truncate w-32">
                  {user?.email}
                </span>
              </div>
            )}
          </div>
        </div>

        {menuOpen && !collapsed && (
          <div className="absolute bottom-16 left-0 w-64 bg-[#111827] border border-white/10 rounded-xl shadow-xl p-2">

            <button
              onClick={() => navigate("/app/billing")}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
            >
              ⭐ Upgrade Plan
            </button>

            <button
              onClick={() => navigate("/app/profile")}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
            >
              👤 Account Details
            </button>

            <button
              onClick={() => navigate("/app/settings")}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
            >
              ⚙ Settings
            </button>

            <button
              onClick={() => navigate("/app/chat")}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
            >
              ❓ Help
            </button>

            <hr className="my-2 border-white/10" />

            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/20"
            >
              🚪 Log out
            </button>

          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;