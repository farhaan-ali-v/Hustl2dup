// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import lingoCompiler from "file:///home/project/node_modules/lingo.dev/build/compiler.mjs";
import dotenv from "file:///home/project/node_modules/dotenv/lib/main.js";
var __vite_injected_original_dirname = "/home/project";
dotenv.config();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBsaW5nb0NvbXBpbGVyIGZyb20gJ2xpbmdvLmRldi9jb21waWxlcic7XG5pbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudic7XG5cbi8vIExvYWQgZW52aXJvbm1lbnQgdmFyaWFibGVzIGZyb20gLmVudiBmaWxlXG5kb3RlbnYuY29uZmlnKCk7XG5cbmNvbnN0IHZpdGVDb25maWcgPSB7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKCkgPT5cbiAgbGluZ29Db21waWxlci52aXRlKHtcbiAgICBzb3VyY2VSb290OiAnc3JjJyxcbiAgICBzb3VyY2VMb2NhbGU6ICdlbicsXG4gICAgdGFyZ2V0TG9jYWxlczogWydlcycsICdmcicsICdkZSddLFxuICAgIG1vZGVsczoge1xuICAgICAgZXM6ICdtaXN0cmFsOm1pc3RyYWwtc21hbGwnLFxuICAgICAgZnI6ICdtaXN0cmFsOm1pc3RyYWwtc21hbGwnLFxuICAgICAgZGU6ICdtaXN0cmFsOm1pc3RyYWwtc21hbGwnLFxuICAgIH0sXG4gICAgbGluZ29EaXI6ICdzcmMvbGluZ28nLFxuICB9KSh2aXRlQ29uZmlnKVxuKTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxZQUFZO0FBSm5CLElBQU0sbUNBQW1DO0FBT3pDLE9BQU8sT0FBTztBQUVkLElBQU0sYUFBYTtBQUFBLEVBQ2pCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRO0FBQUEsRUFBYSxNQUMxQixjQUFjLEtBQUs7QUFBQSxJQUNqQixZQUFZO0FBQUEsSUFDWixjQUFjO0FBQUEsSUFDZCxlQUFlLENBQUMsTUFBTSxNQUFNLElBQUk7QUFBQSxJQUNoQyxRQUFRO0FBQUEsTUFDTixJQUFJO0FBQUEsTUFDSixJQUFJO0FBQUEsTUFDSixJQUFJO0FBQUEsSUFDTjtBQUFBLElBQ0EsVUFBVTtBQUFBLEVBQ1osQ0FBQyxFQUFFLFVBQVU7QUFDZjsiLAogICJuYW1lcyI6IFtdCn0K
