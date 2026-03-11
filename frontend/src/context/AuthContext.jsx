import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= RESTORE ON REFRESH ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken && storedToken !== "undefined") {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  /* ================= LOGIN ================= */
  const login = (userData) => {
    setUser(userData);

    // 🔥 Only set token if it exists
    if (userData.token) {
      setToken(userData.token);
      localStorage.setItem("token", userData.token);
    }

    localStorage.setItem("user", JSON.stringify(userData));
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}