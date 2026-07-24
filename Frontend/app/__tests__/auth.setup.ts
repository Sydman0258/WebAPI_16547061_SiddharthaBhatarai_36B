import { test, expect } from '@playwright/test';

test('authenticate', async ({ page }) => {
  await page.goto('/login');

  await page.getByPlaceholder('name@example.com').fill('customer@test.com');
  await page.getByPlaceholder('••••••••').fill('password123');

  await page.getByRole('button', { name: 'Login' }).click();

await expect(page).toHaveURL(/\/customer/);
  await page.context().storageState({
    path: 'playwright/.auth/customer.json',
  });
});