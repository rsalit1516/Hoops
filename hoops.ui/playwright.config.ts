import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'playwright-results/results.xml' }],
  ],
  use: {
    baseURL: process.env['E2E_BASE_URL'] ?? 'http://localhost:4201',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Logs in once and saves cookie state for admin test suites.
    { name: 'setup', testMatch: /auth\.setup\.ts/ },

    // Unauthenticated browser — used for auth flow tests and public pages.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/admin/**'],
    },

    // Pre-authenticated browser — used for admin tests.
    {
      name: 'chromium:admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testMatch: ['**/admin/**/*.spec.ts'],
    },
  ],
  webServer: {
    command: 'npm run start:e2e',
    url: 'http://localhost:4201',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
