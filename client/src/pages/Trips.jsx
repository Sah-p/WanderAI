import { useEffect, useState } from "react";
import API from "../api";

function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  /* =========================
     FETCH USER'S TRIPS ONLY
     Server filters by JWT token
  ========================= */

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await API.get("/trips");
      setTrips(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE TRIP
  ========================= */

  const deleteTrip = async (id) => {
    if (!window.confirm("Delete this trip? This cannot be undone.")) return;
    try {
      await API.delete(`/trips/${id}`);
      setTrips((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.log(error);
      alert("Error deleting trip. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">

      <h1 className="text-6xl font-bold text-center mb-4">My Saved Trips</h1>
      <p className="text-center text-xl text-gray-500 mb-16">
        All your AI-generated itineraries in one place
      </p>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-400 animate-pulse">Loading your trips...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && trips.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl shadow">
          <p className="text-6xl mb-6">✈️</p>
          <p className="text-3xl font-bold text-gray-600">No saved trips yet</p>
          <p className="text-xl text-gray-400 mt-3">
            Go to Home and generate your first AI trip!
          </p>
        </div>
      )}

      {/* TRIPS LIST */}
      <div className="grid gap-10">
        {trips.map((trip) => (
          <div
            key={trip._id}
            className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-4xl font-bold">{trip.destination}</h2>
                <p className="text-gray-400 mt-1">
                  Saved on {new Date(trip.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </p>
              </div>
              <button
                onClick={() => deleteTrip(trip._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-lg font-bold transition"
              >
                🗑️ Delete
              </button>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl text-center">
                <p className="text-gray-500 text-sm">BUDGET</p>
                <p className="text-xl font-bold">₹{Number(trip.budget).toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center">
                <p className="text-gray-500 text-sm">DAYS</p>
                <p className="text-xl font-bold">{trip.days} Days</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center">
                <p className="text-gray-500 text-sm">STYLE</p>
                <p className="text-xl font-bold">{trip.style}</p>
              </div>
            </div>

            {/* ITINERARY */}
            <div className="bg-slate-50 p-8 rounded-2xl whitespace-pre-wrap text-lg leading-8 max-h-[500px] overflow-auto text-slate-700">
              {trip.trip.replace(/#/g, "").replace(/\*/g, "")}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Trips;
