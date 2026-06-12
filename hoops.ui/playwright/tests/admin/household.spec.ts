import { test, expect } from '@playwright/test';

test.describe('HH: Household management', () => {
  test('HH-01: Create a new household and verify it appears in search results', async ({ page }) => {
    const householdName = `E2E Test ${Date.now()}`;

    await page.goto('/admin/households/new');
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });

    await page.locator('input[formControlName="householdName"]').fill(householdName);
    await page.locator('input[formControlName="address1"]').fill('123 Test Street');
    // city ('Coral Springs') and state ('FL') are pre-populated by HouseholdService.newHousehold()
    await page.locator('input[formControlName="zip"]').fill('33067');
    await page.locator('input[formControlName="phone"]').fill('555-555-5555');

    const saveAndClose = page.getByRole('button', { name: 'Save & Close' });
    await expect(saveAndClose).toBeEnabled({ timeout: 5_000 });
    await saveAndClose.click();

    await expect(page).toHaveURL(/\/admin\/households\/list/, { timeout: 15_000 });

    await page.locator('input[formControlName="searchText"]').fill(householdName);
    await expect(
      page.locator('mat-row', { hasText: householdName })
    ).toBeVisible({ timeout: 15_000 });
  });
});
