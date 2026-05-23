import { useState } from "react";
import API from "../api";

function Home() {
  const [form, setForm] = useState({
    destination: "",
    budget: "",
    days: "",
    style: "Solo",
  });

  const [trip, setTrip] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* =========================
     GENERATE TRIP
  ========================= */

  const generateTrip = async () => {
    if (!form.destination || !form.budget || !form.days) {
      alert("Please fill in Destination, Budget, and Days before generating.");
      return;
    }

    try {
      setLoading(true);
      setTrip("");
      setSaved("");

      const response = await API.post("/generate-trip", form);
      setTrip(response.data.trip);

    } catch (error) {
      console.log(error);
      alert("Error generating trip. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SAVE TRIP
  ========================= */

  const saveTrip = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await API.post("/save-trip", {
        userId: user.id,
        destination: form.destination,
        budget: form.budget,
        days: form.days,
        style: form.style,
        trip,
      });

      setSaved("✅ Trip Saved Successfully! View it in My Trips.");

    } catch (error) {
      console.log(error);
      setSaved("❌ Error Saving Trip. Please try again.");
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">

      {/* ========================
          HERO SECTION
      ======================== */}

      <div
        className="h-[650px] bg-cover bg-center relative flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600')",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-6xl md:text-8xl font-extrabold leading-tight">
            AI Powered<br />Travel Planner
          </h1>
          <p className="text-2xl mt-6 text-slate-200">
            Plan smart, affordable, unforgettable journeys with AI
          </p>
        </div>
      </div>

      {/* ========================
          TRIP FORM
      ======================== */}

      <div className="flex justify-center -mt-28 relative z-20 px-6 pb-20">
        <div className="bg-white w-full max-w-[1600px] rounded-3xl shadow-2xl p-16">

          <h2 className="text-5xl font-bold text-center mb-12">
            ✈️ Create Your AI Trip
          </h2>

          {/* INPUTS */}
          <div className="grid md:grid-cols-2 gap-8">

            <div>
              <label className="block text-xl font-semibold mb-2 text-gray-600">
                Destination
              </label>
              <input
                type="text"
                placeholder="e.g. Goa, Manali, Kerala, Jaipur"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                className="w-full p-5 rounded-2xl border-2 text-2xl outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="block text-xl font-semibold mb-2 text-gray-600">
                Budget (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 15000"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="w-full p-5 rounded-2xl border-2 text-2xl outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="block text-xl font-semibold mb-2 text-gray-600">
                Number of Days
              </label>
              <input
                type="number"
                placeholder="e.g. 5"
                name="days"
                value={form.days}
                onChange={handleChange}
                className="w-full p-5 rounded-2xl border-2 text-2xl outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="block text-xl font-semibold mb-2 text-gray-600">
                Travel Style
              </label>
              <select
                name="style"
                value={form.style}
                onChange={handleChange}
                className="w-full p-5 rounded-2xl border-2 text-2xl outline-none focus:border-cyan-400 transition bg-white"
              >
                <option>Solo</option>
                <option>Friends</option>
                <option>Family</option>
                <option>Couple</option>
                <option>Adventure</option>
              </select>
            </div>

          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={generateTrip}
            disabled={loading}
            className="w-full mt-10 bg-cyan-500 hover:bg-cyan-600 text-white p-6 rounded-2xl text-3xl font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "🤖 Generating your trip..." : "✨ Generate AI Trip"}
          </button>

          {/* AI RESULT */}
          {trip && (
            <div className="mt-14 bg-slate-50 p-10 rounded-3xl border border-slate-200">

              {/* HEADER */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <h2 className="text-4xl font-bold text-slate-800">
                  🗺️ Your AI Travel Plan
                </h2>
                <button
                  onClick={saveTrip}
                  disabled={saved.startsWith("✅")}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl text-xl font-bold transition disabled:opacity-60"
                >
                  {saved.startsWith("✅") ? "✓ Saved" : "💾 Save Trip"}
                </button>
              </div>

              {saved && (
                <p className={`mb-8 text-2xl font-bold ${saved.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
                  {saved}
                </p>
              )}

              {/* OVERVIEW CARDS */}
              <div className="bg-white p-8 rounded-3xl shadow-md mb-10">
                <h3 className="text-3xl font-bold mb-6 text-cyan-600">
                  📍 Trip Overview
                </h3>
                <div className="grid md:grid-cols-4 gap-8 text-xl">
                  <div className="bg-slate-50 p-5 rounded-2xl">
                    <p className="text-gray-500 text-sm mb-1">DESTINATION</p>
                    <p className="font-bold text-2xl">{form.destination}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl">
                    <p className="text-gray-500 text-sm mb-1">BUDGET</p>
                    <p className="font-bold text-2xl">₹{Number(form.budget).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl">
                    <p className="text-gray-500 text-sm mb-1">DURATION</p>
                    <p className="font-bold text-2xl">{form.days} Days</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl">
                    <p className="text-gray-500 text-sm mb-1">STYLE</p>
                    <p className="font-bold text-2xl">{form.style}</p>
                  </div>
                </div>
              </div>

              {/* ITINERARY */}
              <div className="bg-white p-8 rounded-3xl shadow-md">
                <h3 className="text-3xl font-bold mb-6 text-cyan-600">
                  🗓️ Detailed Itinerary
                </h3>
                <div className="whitespace-pre-wrap text-xl leading-[50px] text-slate-700 max-h-[900px] overflow-auto pr-2">
                  {trip.replace(/#/g, "").replace(/\*/g, "")}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}

export default Home;
