import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        AI Hub 🚀
      </h1>

      <p className="text-gray-400 mb-8">
        Access GPT, Claude & Gemini from one platform.
      </p>

      <div className="space-x-4">
        <button
          onClick={() => navigate("/signup")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl"
        >
          Get Started
        </button>

        <button
          onClick={() => navigate("/login")}
          className="border border-white/20 px-6 py-3 rounded-xl"
        >
          Login
        </button>
      </div>
    </div>
  );
}