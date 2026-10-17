import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

const systemChromium =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
    launchOptions: {
      executablePath: systemChromium,
      args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
    },
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
