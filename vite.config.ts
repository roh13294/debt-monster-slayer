
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Handle lovable-tagger import conditionally
let componentTagger: any;
try {
  if (process.env.NODE_ENV === 'development') {
    componentTagger = await import('lovable-tagger').then(m => m.componentTagger);
  }
} catch (e: any) {
  console.warn('lovable-tagger not available:', e.message);
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
}));
