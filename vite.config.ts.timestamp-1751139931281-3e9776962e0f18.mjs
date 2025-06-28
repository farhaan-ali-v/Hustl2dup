// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import lingoCompiler from "file:///home/project/node_modules/lingo.dev/build/compiler.mjs";
var __vite_injected_original_dirname = "/home/project";
var viteConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
};
var vite_config_default = defineConfig(
  () => lingoCompiler.vite({
    sourceRoot: "src",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de"],
    // Add this section:
    models: {
      "es": "mistral:mistral-small",
      "fr": "mistral:mistral-small",
      "de": "mistral:mistral-small"
      // You can use mistral-small, mistral-medium, etc.
    },
    lingoDir: "src/lingo"
  })(viteConfig)
);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBsaW5nb0NvbXBpbGVyIGZyb20gJ2xpbmdvLmRldi9jb21waWxlcic7XG5cbi8vIFdyYXAgeW91ciBjb25maWcgdXNpbmcgbGluZ29Db21waWxlci52aXRlKClcbmNvbnN0IHZpdGVDb25maWcgPSB7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKCkgPT5cbiAgbGluZ29Db21waWxlci52aXRlKHtcbiAgICBzb3VyY2VSb290OiBcInNyY1wiLFxuICAgIHNvdXJjZUxvY2FsZTogXCJlblwiLFxuICAgIHRhcmdldExvY2FsZXM6IFtcImVzXCIsIFwiZnJcIiwgXCJkZVwiXSxcblxuICAgIC8vIEFkZCB0aGlzIHNlY3Rpb246XG4gICAgbW9kZWxzOiB7XG4gICAgICAgIFwiZXNcIjogXCJtaXN0cmFsOm1pc3RyYWwtc21hbGxcIixcbiAgICAgICAgXCJmclwiOiBcIm1pc3RyYWw6bWlzdHJhbC1zbWFsbFwiLFxuICAgICAgICBcImRlXCI6IFwibWlzdHJhbDptaXN0cmFsLXNtYWxsXCIsXG4gLy8gWW91IGNhbiB1c2UgbWlzdHJhbC1zbWFsbCwgbWlzdHJhbC1tZWRpdW0sIGV0Yy5cbiAgICB9LFxuICAgIGxpbmdvRGlyOiBcInNyYy9saW5nb1wiLFxuICB9KSh2aXRlQ29uZmlnKSxcbik7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxtQkFBbUI7QUFIMUIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTSxhQUFhO0FBQUEsRUFDakIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsRUFDMUI7QUFDRjtBQUVBLElBQU8sc0JBQVE7QUFBQSxFQUFhLE1BQzFCLGNBQWMsS0FBSztBQUFBLElBQ2pCLFlBQVk7QUFBQSxJQUNaLGNBQWM7QUFBQSxJQUNkLGVBQWUsQ0FBQyxNQUFNLE1BQU0sSUFBSTtBQUFBO0FBQUEsSUFHaEMsUUFBUTtBQUFBLE1BQ0osTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUEsSUFFVjtBQUFBLElBQ0EsVUFBVTtBQUFBLEVBQ1osQ0FBQyxFQUFFLFVBQVU7QUFDZjsiLAogICJuYW1lcyI6IFtdCn0K
