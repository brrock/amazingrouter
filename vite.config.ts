import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-oxc";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import pluginRewriteAll from "@brrock/vite-plugin-rewrite-all";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA(),
    pluginRewriteAll(),
    tailwindcss(),
  ],
});
