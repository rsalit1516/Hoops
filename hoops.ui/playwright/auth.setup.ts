import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const authFile = 'playwright/.auth/user.json';

setup('authenticate as admin', async ({ page }) => {
  const username = process.env['E2E_USERNAME'];
  const password = process.env['E2E_PASSWORD'];

  if (!username || !password) {
    throw new Error(
      'E2E_USERNAME and E2E_PASSWORD must be set to run admin tests. ' +
      'Create a .env.e2e file or export them before running.'
    );
  }

  await page.goto('/login');
  await page.fill('input[formControlName="userName"]', username);
  await page.fill('input[formControlName="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/(home|admin)/, { timeout: 15_000 });

  const dir = path.dirname(authFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  await page.context().storageState({ path: authFile });
});
