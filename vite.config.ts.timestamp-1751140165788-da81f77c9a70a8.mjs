// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import lingoCompiler from "file:///home/project/node_modules/lingo.dev/build/compiler.mjs";
import "file:///home/project/node_modules/dotenv/config.js";
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
    models: {
      es: "mistral:mistral-small",
      fr: "mistral:mistral-small",
      de: "mistral:mistral-small"
    },
    lingoDir: "src/lingo"
  })(viteConfig)
);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBsaW5nb0NvbXBpbGVyIGZyb20gJ2xpbmdvLmRldi9jb21waWxlcic7XG5pbXBvcnQgJ2RvdGVudi9jb25maWcnO1xuXG5jb25zdCB2aXRlQ29uZmlnID0ge1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICB9LFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCgpID0+XG4gIGxpbmdvQ29tcGlsZXIudml0ZSh7XG4gICAgc291cmNlUm9vdDogJ3NyYycsXG4gICAgc291cmNlTG9jYWxlOiAnZW4nLFxuICAgIHRhcmdldExvY2FsZXM6IFsnZXMnLCAnZnInLCAnZGUnXSxcbiAgICBtb2RlbHM6IHtcbiAgICAgIGVzOiAnbWlzdHJhbDptaXN0cmFsLXNtYWxsJyxcbiAgICAgIGZyOiAnbWlzdHJhbDptaXN0cmFsLXNtYWxsJyxcbiAgICAgIGRlOiAnbWlzdHJhbDptaXN0cmFsLXNtYWxsJyxcbiAgICB9LFxuICAgIGxpbmdvRGlyOiAnc3JjL2xpbmdvJyxcbiAgfSkodml0ZUNvbmZpZylcbik7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTztBQUpQLElBQU0sbUNBQW1DO0FBTXpDLElBQU0sYUFBYTtBQUFBLEVBQ2pCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRO0FBQUEsRUFBYSxNQUMxQixjQUFjLEtBQUs7QUFBQSxJQUNqQixZQUFZO0FBQUEsSUFDWixjQUFjO0FBQUEsSUFDZCxlQUFlLENBQUMsTUFBTSxNQUFNLElBQUk7QUFBQSxJQUNoQyxRQUFRO0FBQUEsTUFDTixJQUFJO0FBQUEsTUFDSixJQUFJO0FBQUEsTUFDSixJQUFJO0FBQUEsSUFDTjtBQUFBLElBQ0EsVUFBVTtBQUFBLEVBQ1osQ0FBQyxFQUFFLFVBQVU7QUFDZjsiLAogICJuYW1lcyI6IFtdCn0K
