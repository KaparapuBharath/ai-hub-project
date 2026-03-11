import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ConversationList from "../workspace/ConversationList";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const [chatPanelOpen, setChatPanelOpen] = useState(false);
  const [init, setInit] = useState(false);
  const location = useLocation();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = {
    background: { color: "transparent" },
    fullScreen: false,
    particles: {
      number: {
        value: 90,
        density: { enable: true, area: 800 },
      },
      color: { value: "#ffffff" },
      links: {
        enable: false
      },
      move: {
        enable: true,
        speed: 0.7,
      },
      size: {
        value: { min: 1, max: 3 },
      },
      opacity: {
        value: 0.4,
      },
    },
  };

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();

    switch (path) {
      case "dashboard":
        return "Dashboard";
      case "chat":
        return "Workspace";
      case "billing":
        return "Billing";
      case "settings":
        return "Settings";
      case "profile":
        return "Account Details";
      default:
        return "";
    }
  };

  return (
    <div className="relative flex min-h-screen text-white bg-black">

      {init && (
        <Particles
          id="particles"
          options={particlesOptions}
          className="absolute inset-0 z-0"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        ${collapsed ? "w-20" : "w-64"}
        transition-all duration-300
        bg-transparent
        relative z-20
      `}
      >
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={() => setCollapsed(!collapsed)} />
      </div>

      {/* Slide Chat Panel */}
      <AnimatePresence>
        {chatPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setChatPanelOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed left-0 top-0 h-full w-80 z-50 border-r border-white/10 p-6 flex flex-col backdrop-blur-xl bg-white/5"
            >
              <button className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-xl font-semibold hover:scale-105 transition">
                + New Chat
              </button>

              <select className="mb-6 bg-white/10 border border-white/10 p-3 rounded-xl text-white backdrop-blur-md">
                <option className="text-black">Ollama (Local)</option>
                <option className="text-black">GPT-4</option>
                <option className="text-black">Claude 3</option>
                <option className="text-black">Gemini Pro</option>
              </select>

              <div className="flex-1 overflow-y-auto">
                <ConversationList />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 bg-transparent relative z-10">
        <Navbar
          title={getPageTitle()}
          openChatPanel={() => setChatPanelOpen(true)}
        />

        <main className="flex-1 px-10 py-8 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
