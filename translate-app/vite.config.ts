import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@/assets/*":"./src/assets/*",
      "@/contexts/*": "./src/contexts/*",
      "@/components/*": "./src/components/*",
      "@/ui/*": "./src/components/ui/*",
      "@/lib/*": "./src/lib/*",
      "@/hooks/*": "./src/hooks/*",
      "@/types/*": "./src/types/*",
    },
  },
});
