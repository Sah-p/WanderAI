import { useState } from "react";
import API from "../api";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* =========================
     SEND MESSAGE
  ========================= */

  const sendMessage = async () => {
    if (!form.name || !form.email || !form.message) {
      setStatus("❌ Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      await API.post("/contact", form);

      setStatus("✅ Message Sent Successfully! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });

    } catch (error) {
      console.log(error);
      setStatus("❌ Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-20">
      <div className="bg-white w-full max-w-2xl p-16 rounded-3xl shadow-2xl">

        <h1 className="text-5xl font-bold text-center mb-3">Contact Us</h1>
        <p className="text-center text-gray-400 text-xl mb-10">
          Have questions? We'd love to hear from you.
        </p>

        <div className="space-y-6">

          <input
            type="text"
            placeholder="Your Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-5 rounded-2xl border-2 text-xl outline-none focus:border-cyan-400 transition"
          />

          <input
            type="email"
            placeholder="Your Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-5 rounded-2xl border-2 text-xl outline-none focus:border-cyan-400 transition"
          />

          <textarea
            placeholder="Your Message"
            rows="5"
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full p-5 rounded-2xl border-2 text-xl outline-none focus:border-cyan-400 transition resize-none"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white p-5 rounded-2xl text-2xl font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {status && (
            <p
              className={`text-center text-xl font-bold ${
                status.startsWith("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {status}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default Contact;
