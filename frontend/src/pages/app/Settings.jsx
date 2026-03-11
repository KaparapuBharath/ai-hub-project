import { useState, useEffect } from "react";
import {
  Brain,
  MessageSquare,
  Shield,
  Bell,
  Database,
  RotateCcw
} from "lucide-react";

/* ---------- Toggle Component ---------- */
function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
        enabled ? "bg-purple-600" : "bg-gray-500"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Settings() {
  const defaultSettings = {
    model: "Llama 3",
    autoSave: true,
    showTimestamp: true,
    allowTraining: false,
    notifications: true,
    temperature: 0.7,
    length: "medium"
  };

  const [settings, setSettings] = useState(defaultSettings);

  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("aihub_settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const toggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const saveSettings = () => {
    localStorage.setItem("aihub_settings", JSON.stringify(settings));
  };

  const clearChat = () => {
    localStorage.removeItem("aihub_chat");
  };

  const exportChat = () => {
    const chat = localStorage.getItem("aihub_chat");
    if (!chat) return;

    const blob = new Blob([chat], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "aihub_chat.json";
    a.click();
  };

  const resetSettings = () => {
    localStorage.removeItem("aihub_settings");
    setSettings(defaultSettings);
  };

  /* -------- Change Password -------- */

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

 const submitPasswordChange = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            password: passwordData.newPassword
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Password updated successfully");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert(data.error || data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="p-10 text-white max-w-5xl mx-auto space-y-10">

      {/* SECURITY */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-yellow-400" />
          <h2 className="text-xl font-semibold">Security</h2>
        </div>

        {!showPassword ? (
          <button
            onClick={() => setShowPassword(true)}
            className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl transition"
          >
            Change Password
          </button>
        ) : (
          <div className="space-y-4 max-w-md">

            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-2"
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-2"
            />

            <div className="flex gap-3">

              <button
                onClick={submitPasswordChange}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl"
              >
                Update Password
              </button>

              <button
                onClick={() => setShowPassword(false)}
                className="bg-gray-700 hover:bg-gray-800 px-6 py-2 rounded-xl"
              >
                Cancel
              </button>

            </div>

          </div>
        )}
      </div>

      {/* AI MODEL */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="text-pink-400" />
          <h2 className="text-xl font-semibold">AI Model</h2>
        </div>

        <select
          name="model"
          value={settings.model}
          onChange={handleChange}
          className="bg-[#0b1120] border border-white/10 rounded-xl px-4 py-2 w-64"
        >
          <option>Llama 3</option>
          <option>Mistral</option>
          <option>Gemma</option>
        </select>
      </div>

      {/* CHAT SETTINGS */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="text-green-400" />
          <h2 className="text-xl font-semibold">Chat Settings</h2>
        </div>

        <div className="space-y-4">

          <label className="flex justify-between items-center">
            <span>Auto Save Conversations</span>
            <Toggle
              enabled={settings.autoSave}
              onChange={() => toggle("autoSave")}
            />
          </label>

          <label className="flex justify-between items-center">
            <span>Show Message Timestamp</span>
            <Toggle
              enabled={settings.showTimestamp}
              onChange={() => toggle("showTimestamp")}
            />
          </label>

        </div>
      </div>

      {/* RESPONSE SETTINGS */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-6">Response Settings</h2>

        <div className="space-y-6">

          <div>
            <label className="block mb-2">
              Creativity ({settings.temperature})
            </label>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  temperature: parseFloat(e.target.value)
                }))
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">Response Length</label>

            <select
              value={settings.length}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  length: e.target.value
                }))
              }
              className="bg-[#0b1120] border border-white/10 rounded-xl px-4 py-2"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>

          </div>

        </div>
      </div>

      {/* PRIVACY */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-yellow-400" />
          <h2 className="text-xl font-semibold">Privacy</h2>
        </div>

        <label className="flex justify-between items-center">
          <span>Allow AI Training Using Conversations</span>

          <Toggle
            enabled={settings.allowTraining}
            onChange={() => toggle("allowTraining")}
          />
        </label>
      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-blue-400" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>

        <label className="flex justify-between items-center">
          <span>Enable Notifications</span>

          <Toggle
            enabled={settings.notifications}
            onChange={() => toggle("notifications")}
          />
        </label>
      </div>

      {/* CHAT HISTORY */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Database className="text-purple-400" />
          <h2 className="text-xl font-semibold">Chat History</h2>
        </div>

        <div className="flex gap-4">

          <button
            onClick={exportChat}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl"
          >
            Export Chat
          </button>

          <button
            onClick={clearChat}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl"
          >
            Clear Chat
          </button>

        </div>
      </div>

      {/* SYSTEM */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <RotateCcw className="text-gray-400" />
          <h2 className="text-xl font-semibold">System</h2>
        </div>

        <button
          onClick={resetSettings}
          className="bg-gray-700 hover:bg-gray-800 px-6 py-2 rounded-xl"
        >
          Reset Settings
        </button>
      </div>

      <div className="flex justify-end">

        <button
          onClick={saveSettings}
          className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-semibold"
        >
          Save Settings
        </button>

      </div>

    </div>
  );
}

export default Settings;