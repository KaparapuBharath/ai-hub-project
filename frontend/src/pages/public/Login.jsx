import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import useAuth from "../../context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("All fields required");
    }

    try {
      setLoading(true);
      const response = await authService.login(form);

      const userData = {
        ...response.user,
        token: response.token,
      };

      authLogin(userData);
      navigate("/app/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-black relative overflow-hidden">

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 w-[350px] text-center">

        <div className="mb-8">
          <h1 className="text-3xl font-semibold 
          bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 
          bg-clip-text text-transparent">
            Welcome 👋
          </h1>
          <p className="text-white/60 text-sm mt-2">
            Sign in to continue
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-2 rounded-full mb-4 text-sm">
            {error}
          </div>
        )}

        {/* FORM START */}
        <form onSubmit={handleSubmit}>

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 px-6 py-3 rounded-full 
            bg-white/10 text-white placeholder-white/60 
            backdrop-blur-md border border-white/20
            focus:outline-none focus:border-white/40 transition"
          />

          <div className="relative mb-6">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-6 py-3 rounded-full 
              bg-white/10 text-white placeholder-white/60 
              backdrop-blur-md border border-white/20
              focus:outline-none focus:border-white/40 transition"
            />

            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-5 top-3 cursor-pointer text-white/60 hover:text-white"
            >
              {showPass ? "🙈" : "👁"}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-medium 
            bg-gradient-to-r from-pink-500 to-rose-500
            hover:from-pink-400 hover:to-rose-400
            text-white transition duration-300 
            shadow-lg shadow-pink-500/30 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

        </form>
        {/* FORM END */}

        <p className="text-white/60 text-sm mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-pink-400 cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>

      </div>
    </div>
  );
}