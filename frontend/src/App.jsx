import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Profile from "./pages/app/Profile";


import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

import Dashboard from "./pages/app/Dashboard";
import Workspace from "./pages/app/Workspace";
import Billing from "./pages/app/Billing";
import Settings from "./pages/app/Settings";

/* 🔥 Temporary Placeholder Pages (Create proper pages later) */
const Placeholder = ({ title }) => (
  <div className="text-white text-2xl font-bold">{title}</div>
);

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Default Redirect */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Main Pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chat" element={<Workspace />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />

          {/* Profile */}
          <Route path="profile" element={<Profile />} />

          {/* 🧰 AI Tools Routes */}
          <Route path="tools/blog" element={<Placeholder title="Blog Generator" />} />
          <Route path="tools/code" element={<Placeholder title="Code Assistant" />} />
          <Route path="tools/email" element={<Placeholder title="Email Writer" />} />
          <Route path="tools/resume" element={<Placeholder title="Resume Optimizer" />} />
          <Route path="tools/data" element={<Placeholder title="Data Analyzer" />} />
          <Route path="tools/image" element={<Placeholder title="Image Prompt Builder" />} />

          {/* 🤖 AI Models Routes */}
          <Route path="models/gpt-3.5" element={<Placeholder title="GPT-3.5 Model" />} />
          <Route path="models/gpt-4" element={<Placeholder title="GPT-4 Model" />} />
          <Route path="models/claude-3" element={<Placeholder title="Claude 3 Model" />} />
          <Route path="models/gemini" element={<Placeholder title="Gemini Pro Model" />} />
          <Route path="models/ollama" element={<Placeholder title="Ollama Local Model" />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;