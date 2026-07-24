import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Teach Vitest the same "@/…" → "src/…" alias the app uses (from tsconfig), so
// unit tests can import modules that reference it.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
