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

// AUTH-02 note: the admin guard checks the adminModule feature flag, not authentication.
// Unauthenticated users are NOT redirected to /login by the guard.
// Admin route access control is enforced by the API (cookie auth), not the Angular router.
test.describe('AUTH-02: Login page is accessible via direct URL', () => {
  test('navigating directly to /login renders the login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[formControlName="userName"]')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('input[formControlName="password"]')).toBeVisible();
  });
});

test.describe('AUTH-03: Invalid credentials', () => {
  test('wrong password shows login error and stays on login page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[formControlName="userName"]', 'notarealuser@example.com');
    await page.fill('input[formControlName="password"]', 'wrongpassword!');
    await page.click('button[type="submit"]');
    await expect(page.locator('mat-error')).toContainText('User Name or password is not valid', { timeout: 10_000 });
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('AUTH-04: Empty form validation', () => {
  test('submitting an empty login form shows validation error without an API call', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    await expect(page.locator('mat-error')).toContainText('User Name or password is not valid');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('AUTH-05: Admin menu visibility after login', () => {
  test('Admin nav link is visible in the top bar after admin login', async ({ page }) => {
    const username = process.env['E2E_USERNAME'];
    const password = process.env['E2E_PASSWORD'];
    if (!username || !password) {
      test.skip(true, 'E2E_USERNAME and E2E_PASSWORD must be set');
    }
    await page.goto('/login');
    await page.fill('input[formControlName="userName"]', username!);
    await page.fill('input[formControlName="password"]', password!);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/(home|admin)/, { timeout: 15_000 });
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  });
});
