import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import federation from '@originjs/vite-plugin-federation';
import react from "@vitejs/plugin-react";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        "mf-chat": 'http://localhost:5174/dist/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.svg"],
  build: {
    target: 'esnext',
    minify: false,
  },
});
