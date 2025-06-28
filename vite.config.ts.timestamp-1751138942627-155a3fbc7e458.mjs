// vite.config.ts
import "file:///home/project/node_modules/dotenv/config.js";
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
    models: {
      ":": "mistral-ai/mistral-7b-instruct"
    }
  })(viteConfig)
);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgJ2RvdGVudi9jb25maWcnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgbGluZ29Db21waWxlciBmcm9tICdsaW5nby5kZXYvY29tcGlsZXInO1xuXG4vLyBXcmFwIHlvdXIgY29uZmlnIHVzaW5nIGxpbmdvQ29tcGlsZXIudml0ZSgpXG5jb25zdCB2aXRlQ29uZmlnID0ge1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICB9LFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCgpID0+XG4gIGxpbmdvQ29tcGlsZXIudml0ZSh7XG4gICAgc291cmNlUm9vdDogXCJzcmNcIixcbiAgICB0YXJnZXRMb2NhbGVzOiBbXCJlc1wiLCBcImZyXCIsIFwiZGVcIl0sXG4gICAgbW9kZWxzOiB7XG4gICAgICBcIjpcIjogXCJtaXN0cmFsLWFpL21pc3RyYWwtN2ItaW5zdHJ1Y3RcIixcbiAgICB9LFxuICB9KSh2aXRlQ29uZmlnKSxcbik7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixPQUFPO0FBQ2hPLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxtQkFBbUI7QUFKMUIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTSxhQUFhO0FBQUEsRUFDakIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsRUFDMUI7QUFDRjtBQUVBLElBQU8sc0JBQVE7QUFBQSxFQUFhLE1BQzFCLGNBQWMsS0FBSztBQUFBLElBQ2pCLFlBQVk7QUFBQSxJQUNaLGVBQWUsQ0FBQyxNQUFNLE1BQU0sSUFBSTtBQUFBLElBQ2hDLFFBQVE7QUFBQSxNQUNOLEtBQUs7QUFBQSxJQUNQO0FBQUEsRUFDRixDQUFDLEVBQUUsVUFBVTtBQUNmOyIsCiAgIm5hbWVzIjogW10KfQo=
