import axios from "axios";

/* =========================
   AXIOS INSTANCE
   Base URL points to backend
========================= */

const API = axios.create({
  baseURL: "http://localhost:5000",
});

/* =========================
   REQUEST INTERCEPTOR
   Attaches JWT token to every
   outgoing request automatically
========================= */

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
