import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     FORGOT PASSWORD STATES
  ========================= */

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState(1);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* =========================
     LOGIN USER
  ========================= */

  const loginUser = async () => {
    if (loading) return;

    setMessage("");

    try {
      setLoading(true);

      const response = await API.post("/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessage("✅ Login Successful!");

      setTimeout(() => navigate("/"), 1000);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "❌ Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ENTER KEY SUPPORT
  ========================= */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      loginUser();
    }
  };

  /* =========================
     SEND OTP
  ========================= */

  const sendOtp = async () => {
    if (!forgotEmail) {
      alert("Enter email");
      return;
    }

    try {
      await API.post("/forgot-password/check", {
        email: forgotEmail,
      });

      const randomOtp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      setGeneratedOtp(randomOtp);

      alert("Demo OTP: " + randomOtp);

      setStep(2);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Email not found"
      );
    }
  };

  /* =========================
     VERIFY OTP
  ========================= */

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setStep(3);
    } else {
      alert("Invalid OTP");
    }
  };

  /* =========================
     RESET PASSWORD
  ========================= */

  const resetPassword = async () => {
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.post("/forgot-password/reset", {
        email: forgotEmail,
        newPassword,
      });

      alert("Password reset successful");

      setShowForgot(false);

      setStep(1);
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Reset failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">

      {/* LOGIN CARD */}

      <div className="bg-white w-full max-w-2xl p-16 rounded-3xl shadow-2xl">

        <h1 className="text-6xl font-bold text-center mb-4">
          Welcome Back
        </h1>

        <p className="text-center text-gray-400 text-xl mb-12">
          Login to plan your next trip
        </p>

        <div className="space-y-6">

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full p-6 rounded-2xl border text-2xl outline-none focus:border-cyan-400 transition"
          />

          {/* PASSWORD */}

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full p-6 rounded-2xl border text-2xl outline-none focus:border-cyan-400 transition"
          />

          {/* FORGOT PASSWORD */}

          <div className="flex justify-end">
            <button
              onClick={() => setShowForgot(true)}
              className="text-cyan-500 hover:underline text-lg"
            >
              Forgot Password?
            </button>
          </div>

          {/* LOGIN BUTTON */}

          <button
            onClick={loginUser}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white p-6 rounded-2xl text-2xl font-bold transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* MESSAGE */}

          {message && (
            <p
              className={`text-center text-xl font-bold ${
                message.startsWith("✅")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* SIGNUP */}

          <p className="text-center text-xl text-gray-500">
            Don't have an account?{" "}
            <NavLink
              to="/signup"
              className="text-cyan-500 font-bold hover:underline"
            >
              Signup
            </NavLink>
          </p>

        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}

      {showForgot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-10 rounded-3xl w-[450px] shadow-2xl">

            <h2 className="text-4xl font-bold text-center mb-8">
              Forgot Password
            </h2>

            {/* STEP 1 */}

            {step === 1 && (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) =>
                    setForgotEmail(e.target.value)
                  }
                  className="w-full p-5 border rounded-2xl text-xl mb-6 outline-none"
                />

                <button
                  onClick={sendOtp}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white p-5 rounded-2xl text-xl font-bold"
                >
                  Send OTP
                </button>
              </>
            )}

            {/* STEP 2 */}

            {step === 2 && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                  className="w-full p-5 border rounded-2xl text-xl mb-6 outline-none"
                />

                <button
                  onClick={verifyOtp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white p-5 rounded-2xl text-xl font-bold"
                >
                  Verify OTP
                </button>
              </>
            )}

            {/* STEP 3 */}

            {step === 3 && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  className="w-full p-5 border rounded-2xl text-xl mb-4 outline-none"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="w-full p-5 border rounded-2xl text-xl mb-6 outline-none"
                />

                <button
                  onClick={resetPassword}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white p-5 rounded-2xl text-xl font-bold"
                >
                  Reset Password
                </button>
              </>
            )}

            {/* CLOSE BUTTON */}

            <button
              onClick={() => {
                setShowForgot(false);
                setStep(1);
              }}
              className="w-full mt-6 text-red-500 text-lg font-bold"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Login;