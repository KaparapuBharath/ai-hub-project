import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password.trim();
    const confirm = form.confirm.trim();

    if (!name || !email || !password || !confirm) {
      return setError("All fields are required");
    }

    if (!validateEmail(email)) {
      return setError("Invalid email format");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      await authService.register({
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-black to-emerald-900 px-4">
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md text-center"
      >
        <h2 className="text-3xl font-semibold text-green-300 mb-8">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 px-5 py-3 rounded-full bg-white/10 text-white placeholder-green-200 outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 px-5 py-3 rounded-full bg-white/10 text-white placeholder-green-200 outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="relative mb-4">
          <input
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-full bg-white/10 text-white placeholder-green-200 outline-none focus:ring-2 focus:ring-green-500"
          />
          <span
            className="absolute right-5 top-3 cursor-pointer text-green-300"
            onClick={() => setShowPass((prev) => !prev)}
          >
            {showPass ? "🙈" : "👁"}
          </span>
        </div>

        <input
          name="confirm"
          type="password"
          placeholder="Confirm password"
          value={form.confirm}
          onChange={handleChange}
          className="w-full mb-6 px-5 py-3 rounded-full bg-white/10 text-white placeholder-green-200 outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-full font-semibold transition duration-300 ${
            loading
              ? "bg-green-700 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105"
          } text-white`}
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        <p className="text-green-200 text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer text-green-400 hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}