import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import API from "../api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* =========================
     SIGNUP USER
  ========================= */

  const signupUser = async () => {
    if (loading) return;
    setMessage("");

    try {
      setLoading(true);

      const response = await API.post("/signup", form);

      setMessage("✅ " + (response.data.message || "Signup Successful!"));
      setForm({ name: "", email: "", password: "" });

      setTimeout(() => navigate("/login"), 1500);

    } catch (error) {
      setMessage(
        "❌ " + (error.response?.data?.message || error.message || "Signup Failed")
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ENTER KEY SUPPORT
  ========================= */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) signupUser();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
      <div className="bg-white w-full max-w-2xl p-16 rounded-3xl shadow-2xl">

        <h1 className="text-6xl font-bold text-center mb-4">Create Account</h1>
        <p className="text-center text-gray-400 text-xl mb-12">
          Join WanderAI and start exploring
        </p>

        <div className="space-y-6">

          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full p-6 rounded-2xl border text-2xl outline-none focus:border-cyan-400 transition"
          />

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full p-6 rounded-2xl border text-2xl outline-none focus:border-cyan-400 transition"
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full p-6 rounded-2xl border text-2xl outline-none focus:border-cyan-400 transition"
          />

          <button
            onClick={signupUser}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white p-6 rounded-2xl text-2xl font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Signup"}
          </button>

          {message && (
            <p
              className={`text-center text-xl font-bold ${
                message.startsWith("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-center text-xl text-gray-500">
            Already have an account?{" "}
            <NavLink to="/login" className="text-cyan-500 font-bold hover:underline">
              Login
            </NavLink>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;
