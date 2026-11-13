import { defineConfig, devices } from "@playwright/test";

// E2E_PROD=1 tests the production build (with its CSP) instead of the dev server.
const port = 5391;
const command = process.env.E2E_PROD
  ? `VITE_RP_ID=localhost npm run build && npm run preview -- --port ${port} --strictPort`
  : `npm run dev -- --port ${port} --strictPort`;

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: `http://localhost:${port}` },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
  },
});
