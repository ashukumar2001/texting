import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Texting - Chat app",
        start_url: "/",
        short_name: "texting",
        description: "a simple real-time chat application",
        theme_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "texting-app-icon_192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "texting-app-icon_512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        importScripts: ["/push-sw.js"],
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        globIgnores: ["**/node_modules/**/*", "***/push-sw.js"],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
