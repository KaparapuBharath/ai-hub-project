import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

/* APPLY SAVED THEME ON START */
function ThemeInitializer({ children }) {
  useEffect(() => {
    const saved = localStorage.getItem("aihub_settings");

    if (saved) {
      const settings = JSON.parse(saved);

      if (settings.theme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeInitializer>
        <App />
      </ThemeInitializer>
    </AuthProvider>
  </React.StrictMode>
);