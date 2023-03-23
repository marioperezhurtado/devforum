/// <reference types="vitest" />

import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { loadEnvConfig } from "@next/env"
import { fileURLToPath } from "url"

export default defineConfig(() => {
  loadEnvConfig(process.cwd())

  return {
    plugins: [react()],
    test: {
      environment: "jsdom",
      include: ["**/*.test.tsx"],
      alias: {
        "@/": fileURLToPath(new URL("./src/", import.meta.url)),
      },
    },
  }
})
