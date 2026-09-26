// src/main.jsx
// ------------------------------------------------------------------
// The actual JavaScript entry point (referenced by index.html).
// This is where React "mounts" onto the #root div and where we wrap
// the whole app with our global providers (Router, Auth, Theme).
// ------------------------------------------------------------------

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter enables client-side page navigation (React Router) */}
    <BrowserRouter>
      {/* ThemeProvider + AuthProvider make dark-mode & login state
          available to every page/component in the tree below */}
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
