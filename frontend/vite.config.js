// vite.config.js
// ------------------------------------------------------------------
// Vite is the build tool that runs our dev server and bundles the
// React app for production. This config just registers the React
// plugin (JSX support, fast refresh, etc).
// ------------------------------------------------------------------

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
