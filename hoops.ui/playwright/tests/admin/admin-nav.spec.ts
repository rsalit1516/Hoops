import { test, expect } from '@playwright/test';

test.describe('ADMIN-NAV: Admin navigation sidebar', () => {
  test('ADMIN-NAV-01: /admin/dashboard loads without redirecting to login', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test('ADMIN-NAV-02: Admin sidenav is visible and contains a Dashboard link', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
    const sidenav = page.locator('mat-sidenav-container');
    await expect(sidenav).toBeVisible();
    await expect(sidenav.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  });

  test('ADMIN-NAV-03: Households link is visible in the admin sidenav', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
    await expect(
      page.locator('mat-sidenav-container').getByRole('link', { name: 'Households' })
    ).toBeVisible();
  });

  test('ADMIN-NAV-04: Clicking the Households link navigates to /admin/households', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
    await page.locator('mat-sidenav-container').getByRole('link', { name: 'Households' }).click();
    await expect(page).toHaveURL(/\/admin\/households/, { timeout: 10_000 });
  });
});
