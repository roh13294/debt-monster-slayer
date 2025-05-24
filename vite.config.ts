
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Conditionally import componentTagger only in development
let componentTagger: any;
try {
  if (process.env.NODE_ENV !== 'production') {
    componentTagger = require('lovable-tagger').componentTagger;
  }
} catch (error) {
  // If lovable-tagger is not available, continue without it
  componentTagger = null;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger ? componentTagger() : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    jsx: 'automatic'
  }
}));
