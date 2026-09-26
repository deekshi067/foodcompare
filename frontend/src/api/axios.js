// src/api/axios.js
// ------------------------------------------------------------------
// A single, pre-configured Axios instance used by the whole app.
// Centralizing it here means:
//   - we only set the base URL once
//   - we automatically attach the JWT token to every request
//   - we can handle 401 (session expired) globally in one place
// ------------------------------------------------------------------

import axios from "axios";

const api = axios.create({
  // In development this points to our Express server (see .env.example
  // in the frontend: VITE_API_URL). Falls back to localhost:5000.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// --- REQUEST interceptor: runs before every request is sent --------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fc_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- RESPONSE interceptor: runs on every response/error ------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the token is invalid/expired, log the user out automatically.
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("fc_token");
      localStorage.removeItem("fc_user");
      // Avoid a hard redirect loop if we're already on the login page.
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
