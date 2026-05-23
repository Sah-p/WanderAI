import { Routes, Route, NavLink, useNavigate, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import Trips from "./pages/Trips";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Chatbot from "./pages/Chatbot";

function App() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  /* =========================
     LOGOUT
  ========================= */

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLink = ({ isActive }) =>
    isActive ? "text-cyan-400" : "hover:text-cyan-400 transition";

  return (
    <div className="bg-slate-100 min-h-screen">

      {/* ========================
          NAVBAR
      ======================== */}

      <nav className="bg-slate-950 text-white px-20 py-8 flex justify-between items-center shadow-xl sticky top-0 z-50">

        {/* LOGO */}
        <h1 className="text-5xl font-extrabold text-cyan-400 tracking-tight">
          WanderAI
        </h1>

        {/* NAV LINKS */}
        <div className="flex gap-10 text-xl font-semibold items-center">

          {user ? (
            user.isAdmin ? (

              /* ---- ADMIN NAVBAR ---- */
              <>
                <NavLink to="/admin" className={navLink}>Dashboard</NavLink>
                <p className="text-cyan-400 font-bold">👤 Admin</p>
                <button
                  onClick={logoutUser}
                  className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl text-lg font-bold transition"
                >
                  Logout
                </button>
              </>

            ) : (

              /* ---- USER NAVBAR ---- */
              <>
                <NavLink to="/" className={navLink}>Home</NavLink>
                <NavLink to="/destinations" className={navLink}>Destinations</NavLink>
                <NavLink to="/trips" className={navLink}>Trips</NavLink>
                <NavLink to="/contact" className={navLink}>Contact</NavLink>
                <NavLink to="/chatbot" className={navLink}>AI Chat</NavLink>
                <p className="text-cyan-400 font-bold">👤 {user.name}</p>
                <button
                  onClick={logoutUser}
                  className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl text-lg font-bold transition"
                >
                  Logout
                </button>
              </>

            )
          ) : (

            /* ---- GUEST NAVBAR ---- */
            <>
              <NavLink to="/login" className={navLink}>Login</NavLink>
              <NavLink to="/signup" className={navLink}>Signup</NavLink>
            </>

          )}
        </div>
      </nav>

      {/* ========================
          ROUTES
      ======================== */}

      <Routes>
        {user ? (
          user.isAdmin ? (
            /* ---- ADMIN ROUTES ---- */
            <>
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/admin" />} />
            </>
          ) : (
            /* ---- USER ROUTES ---- */
            <>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )
        ) : (
          /* ---- GUEST ROUTES ---- */
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>

    </div>
  );
}

export default App;
