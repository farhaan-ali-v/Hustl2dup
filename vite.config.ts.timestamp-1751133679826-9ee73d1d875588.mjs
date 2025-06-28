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
    // You can customize these
    models: {
      ":": "mistral:mistral-7b-instruct"
    }
  })(viteConfig)
);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBsaW5nb0NvbXBpbGVyIGZyb20gJ2xpbmdvLmRldi9jb21waWxlcic7XG5cbi8vIFdyYXAgeW91ciBjb25maWcgdXNpbmcgbGluZ29Db21waWxlci52aXRlKClcbmNvbnN0IHZpdGVDb25maWcgPSB7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKCkgPT5cbiAgbGluZ29Db21waWxlci52aXRlKHtcbiAgICBzb3VyY2VSb290OiAnc3JjJyxcbiAgICB0YXJnZXRMb2NhbGVzOiBbJ2VzJywgJ2ZyJywgJ2RlJ10sIC8vIFlvdSBjYW4gY3VzdG9taXplIHRoZXNlXG4gICAgbW9kZWxzOiB7XG4gICAgICBcIjpcIjogXCJtaXN0cmFsOm1pc3RyYWwtN2ItaW5zdHJ1Y3RcIlxuICAgIH1cbiAgfSkodml0ZUNvbmZpZylcbik7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxtQkFBbUI7QUFIMUIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTSxhQUFhO0FBQUEsRUFDakIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsRUFDMUI7QUFDRjtBQUVBLElBQU8sc0JBQVE7QUFBQSxFQUFhLE1BQzFCLGNBQWMsS0FBSztBQUFBLElBQ2pCLFlBQVk7QUFBQSxJQUNaLGVBQWUsQ0FBQyxNQUFNLE1BQU0sSUFBSTtBQUFBO0FBQUEsSUFDaEMsUUFBUTtBQUFBLE1BQ04sS0FBSztBQUFBLElBQ1A7QUFBQSxFQUNGLENBQUMsRUFBRSxVQUFVO0FBQ2Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
