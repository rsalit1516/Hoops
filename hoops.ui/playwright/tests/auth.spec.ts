import { test, expect } from '@playwright/test';

test.describe('AUTH-01: Login / Logout', () => {
  test('valid credentials redirect to home and logout clears session', async ({ page }) => {
    const username = process.env['E2E_USERNAME'];
    const password = process.env['E2E_PASSWORD'];

    if (!username || !password) {
      test.skip(true, 'E2E_USERNAME and E2E_PASSWORD required');
    }

    await page.goto('/login');
    await page.fill('input[formControlName="userName"]', username!);
    await page.fill('input[formControlName="password"]', password!);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/(home|admin)/, { timeout: 15_000 });

    // Logout
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/\/(home|login)/);

    // Admin is no longer accessible
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('AUTH-02: Unauthenticated redirect', () => {
  test('navigating to /admin/dashboard while logged out redirects to /login with returnUrl', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/login/);
    expect(page.url()).toContain('returnUrl');
  });
});
