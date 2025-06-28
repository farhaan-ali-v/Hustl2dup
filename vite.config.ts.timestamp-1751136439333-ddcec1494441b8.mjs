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
    // You can customize these
    models: {
      "es": "mistral:mistral-7b-instruct",
      "fr": "mistral:mistral-7b-instruct",
      "de": "mistral:mistral-7b-instruct"
    }
  })(viteConfig)
);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgJ2RvdGVudi9jb25maWcnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgbGluZ29Db21waWxlciBmcm9tICdsaW5nby5kZXYvY29tcGlsZXInO1xuXG4vLyBXcmFwIHlvdXIgY29uZmlnIHVzaW5nIGxpbmdvQ29tcGlsZXIudml0ZSgpXG5jb25zdCB2aXRlQ29uZmlnID0ge1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICB9LFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCgpID0+XG4gIGxpbmdvQ29tcGlsZXIudml0ZSh7XG4gICAgc291cmNlUm9vdDogJ3NyYycsXG4gICAgdGFyZ2V0TG9jYWxlczogWydlcycsICdmcicsICdkZSddLCAvLyBZb3UgY2FuIGN1c3RvbWl6ZSB0aGVzZVxuICAgIG1vZGVsczoge1xuICAgICAgXCJlc1wiOiBcIm1pc3RyYWw6bWlzdHJhbC03Yi1pbnN0cnVjdFwiLFxuICAgICAgXCJmclwiOiBcIm1pc3RyYWw6bWlzdHJhbC03Yi1pbnN0cnVjdFwiLFxuICAgICAgXCJkZVwiOiBcIm1pc3RyYWw6bWlzdHJhbC03Yi1pbnN0cnVjdFwiXG4gICAgfVxuICB9KSh2aXRlQ29uZmlnKVxuKTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLE9BQU87QUFDaE8sU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLG1CQUFtQjtBQUoxQixJQUFNLG1DQUFtQztBQU96QyxJQUFNLGFBQWE7QUFBQSxFQUNqQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUNGO0FBRUEsSUFBTyxzQkFBUTtBQUFBLEVBQWEsTUFDMUIsY0FBYyxLQUFLO0FBQUEsSUFDakIsWUFBWTtBQUFBLElBQ1osZUFBZSxDQUFDLE1BQU0sTUFBTSxJQUFJO0FBQUE7QUFBQSxJQUNoQyxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0YsQ0FBQyxFQUFFLFVBQVU7QUFDZjsiLAogICJuYW1lcyI6IFtdCn0K
