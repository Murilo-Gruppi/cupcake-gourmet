import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E config
 *
 * Para executar:
 *   1. npm run db:up && npm run db:seed  (banco + dados)
 *   2. npm run dev                        (app em http://localhost:3000)
 *   3. npm run test:e2e                   (testes E2E)
 *
 * Ou com servidor automático:
 *   npx playwright test --ui
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // pedidos têm estado compartilhado
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  // webServer: {
  //   command: "npm run dev",
  //   url: "http://localhost:3000",
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
