import { test, expect } from '@playwright/test';

test.describe('Public pages', () => {
  test('PUB-01: schedule page loads and renders content', async ({ page }) => {
    await page.goto('/games/schedule');

    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('csbc-schedule-shell')).toBeVisible({ timeout: 15_000 });
  });

  test('PUB-02: standings page loads and renders standings table', async ({ page }) => {
    await page.goto('/games/standings');

    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('csbc-standings-shell')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('table#grdSchedule')).toBeVisible({ timeout: 15_000 });
  });

  test('PUB-03: playoffs page loads and renders content', async ({ page }) => {
    await page.goto('/games/playoffs');

    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('csbc-playoffs-shell')).toBeVisible({ timeout: 15_000 });
  });
});
