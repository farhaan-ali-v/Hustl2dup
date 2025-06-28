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
    targetLocales: ["es", "fr", "de"],
    // Target locales
    models: {
      // Define models for each locale
      es: "mistral",
      fr: "mistral",
      de: "mistral"
    }
  })(viteConfig)
);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBsaW5nb0NvbXBpbGVyIGZyb20gJ2xpbmdvLmRldi9jb21waWxlcic7XG5cbi8vIFdyYXAgeW91ciBjb25maWcgdXNpbmcgbGluZ29Db21waWxlci52aXRlKClcbmNvbnN0IHZpdGVDb25maWcgPSB7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKCkgPT5cbiAgbGluZ29Db21waWxlci52aXRlKHtcbiAgICBzb3VyY2VSb290OiAnc3JjJyxcbiAgICB0YXJnZXRMb2NhbGVzOiBbJ2VzJywgJ2ZyJywgJ2RlJ10sIC8vIFRhcmdldCBsb2NhbGVzXG4gICAgbW9kZWxzOiB7XG4gICAgICAvLyBEZWZpbmUgbW9kZWxzIGZvciBlYWNoIGxvY2FsZVxuICAgICAgZXM6IFwibWlzdHJhbFwiLFxuICAgICAgZnI6IFwibWlzdHJhbFwiLFxuICAgICAgZGU6IFwibWlzdHJhbFwiXG4gICAgfSxcbiAgfSkodml0ZUNvbmZpZylcbik7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sbUJBQW1CO0FBSDFCLElBQU0sbUNBQW1DO0FBTXpDLElBQU0sYUFBYTtBQUFBLEVBQ2pCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRO0FBQUEsRUFBYSxNQUMxQixjQUFjLEtBQUs7QUFBQSxJQUNqQixZQUFZO0FBQUEsSUFDWixlQUFlLENBQUMsTUFBTSxNQUFNLElBQUk7QUFBQTtBQUFBLElBQ2hDLFFBQVE7QUFBQTtBQUFBLE1BRU4sSUFBSTtBQUFBLE1BQ0osSUFBSTtBQUFBLE1BQ0osSUFBSTtBQUFBLElBQ047QUFBQSxFQUNGLENBQUMsRUFBRSxVQUFVO0FBQ2Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
