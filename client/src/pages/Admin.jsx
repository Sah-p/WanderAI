import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

function Admin() {

  /* =========================
     ALL HOOKS FIRST
     (React Rules of Hooks)
  ========================= */

  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.isAdmin) fetchData();
  }, []);

  /* =========================
     ADMIN GUARD
     (after all hooks)
  ========================= */

  if (!user?.isAdmin) {
    return <Navigate to="/" />;
  }

  /* =========================
     FETCH ALL DATA
  ========================= */

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, tripsRes, contactsRes] = await Promise.all([
        API.get("/users"),
        API.get("/trips"),
        API.get("/contacts"),
      ]);
      setUsers(usersRes.data);
      setTrips(tripsRes.data);
      setContacts(contactsRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE HANDLERS
  ========================= */

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) { console.log(error); }
  };

  const deleteTrip = async (id) => {
    if (!window.confirm("Delete this trip permanently?")) return;
    try {
      await API.delete(`/trips/${id}`);
      setTrips((prev) => prev.filter((t) => t._id !== id));
    } catch (error) { console.log(error); }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      await API.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (error) { console.log(error); }
  };

  /* =========================
     CHART DATA — Dynamic
  ========================= */

  // Build destination data dynamically from real trips
  const destMap = trips.reduce((acc, t) => {
    const d = t.destination || "Other";
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const destinationData = Object.entries(destMap)
    .map(([name, count]) => ({ name, trips: count }))
    .sort((a, b) => b.trips - a.trips)
    .slice(0, 8); // top 8

  const pieData = [
    { name: "Users", value: users.length },
    { name: "Trips", value: trips.length },
    { name: "Contacts", value: contacts.length },
  ];

  const PIE_COLORS = ["#06b6d4", "#22c55e", "#ef4444"];

  /* =========================
     SEARCH FILTER HELPER
  ========================= */

  const s = search.toLowerCase();

  return (
    <div className="bg-slate-100 min-h-screen px-8 py-16">

      {/* TITLE */}
      <h1 className="text-6xl font-bold text-center mb-8">
        🛠️ Admin Dashboard
      </h1>

      {/* SEARCH */}
      <div className="flex justify-center mb-14">
        <input
          type="text"
          placeholder="Search users, trips or contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-3xl p-5 rounded-2xl border-2 text-xl outline-none focus:border-cyan-400 transition shadow-lg"
        />
      </div>

      {/* STAT CARDS */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center border-t-4 border-cyan-500">
          <h2 className="text-6xl font-extrabold text-cyan-500">{users.length}</h2>
          <p className="text-2xl mt-3 font-semibold text-gray-600">Total Users</p>
        </div>
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center border-t-4 border-green-500">
          <h2 className="text-6xl font-extrabold text-green-500">{trips.length}</h2>
          <p className="text-2xl mt-3 font-semibold text-gray-600">Saved Trips</p>
        </div>
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center border-t-4 border-red-500">
          <h2 className="text-6xl font-extrabold text-red-500">{contacts.length}</h2>
          <p className="text-2xl mt-3 font-semibold text-gray-600">Contact Messages</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">

        {/* BAR CHART */}
        <div className="bg-white p-10 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-bold mb-8">📊 Trips by Destination</h2>
          {destinationData.length === 0 ? (
            <p className="text-gray-400 text-xl text-center py-20">No trips yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={destinationData}>
                <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="trips" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-10 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-bold mb-8">🥧 Platform Overview</h2>
          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={130}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ========================
          USERS TABLE
      ======================== */}

      <div className="bg-white p-10 rounded-3xl shadow-xl mb-12">
        <h2 className="text-4xl font-bold mb-8">👤 Users ({users.length})</h2>

        {users.filter(
          (u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
        ).length === 0 ? (
          <p className="text-gray-400 text-xl">No users found.</p>
        ) : (
          <div className="grid gap-4">
            {users
              .filter(
                (u) =>
                  u.name.toLowerCase().includes(s) ||
                  u.email.toLowerCase().includes(s)
              )
              .map((u) => (
                <div
                  key={u._id}
                  className="bg-slate-50 p-6 rounded-2xl flex justify-between items-center hover:bg-slate-100 transition"
                >
                  <div>
                    <p className="text-xl font-bold">{u.name}</p>
                    <p className="text-lg text-gray-500">{u.email}</p>
                    {u.createdAt && (
                      <p className="text-sm text-gray-400 mt-1">
                        Joined: {new Date(u.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-lg font-bold transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ========================
          TRIPS TABLE
      ======================== */}

      <div className="bg-white p-10 rounded-3xl shadow-xl mb-12">
        <h2 className="text-4xl font-bold mb-8">✈️ All Trips ({trips.length})</h2>

        <div className="grid gap-8">
          {trips
            .filter(
              (t) =>
                t.destination.toLowerCase().includes(s) ||
                t.style.toLowerCase().includes(s)
            )
            .map((trip) => (
              <div
                key={trip._id}
                className="bg-slate-50 p-8 rounded-2xl border border-slate-200"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-3xl font-bold">{trip.destination}</h3>
                    {trip.createdAt && (
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(trip.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTrip(trip._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-lg font-bold transition"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                    <p className="text-gray-500 text-xs">BUDGET</p>
                    <p className="font-bold text-xl">₹{Number(trip.budget).toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                    <p className="text-gray-500 text-xs">DAYS</p>
                    <p className="font-bold text-xl">{trip.days}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                    <p className="text-gray-500 text-xs">STYLE</p>
                    <p className="font-bold text-xl">{trip.style}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl whitespace-pre-wrap text-lg leading-8 max-h-[350px] overflow-auto text-slate-700">
                  {trip.trip.replace(/#/g, "").replace(/\*/g, "")}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ========================
          CONTACTS TABLE
      ======================== */}

      <div className="bg-white p-10 rounded-3xl shadow-xl">
        <h2 className="text-4xl font-bold mb-8">📩 Contact Messages ({contacts.length})</h2>

        <div className="grid gap-5">
          {contacts
            .filter(
              (c) =>
                c.name.toLowerCase().includes(s) ||
                c.email.toLowerCase().includes(s) ||
                c.message.toLowerCase().includes(s)
            )
            .map((contact) => (
              <div
                key={contact._id}
                className="bg-slate-50 p-6 rounded-2xl flex justify-between items-start hover:bg-slate-100 transition"
              >
                <div className="flex-1 pr-6">
                  <div className="flex gap-6 mb-3">
                    <p className="font-bold text-xl">{contact.name}</p>
                    <p className="text-gray-500 text-xl">{contact.email}</p>
                  </div>
                  <p className="text-lg text-gray-700 leading-7">{contact.message}</p>
                  {contact.createdAt && (
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(contact.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteContact(contact._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-lg font-bold transition flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
}

export default Admin;
