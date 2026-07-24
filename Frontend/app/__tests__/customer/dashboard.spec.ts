import { test, expect } from '@playwright/test';

test.describe('Customer Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/customer');

    await expect(page).toHaveURL(/\/customer/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display the customer dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(
      /Good (morning|afternoon|evening)/i
    );

    await expect(page.getByText(/Delivering to/i)).toBeVisible();

    await expect(
      page.getByRole('link', { name: /Change/i })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: /Craving something delicious/i,
      })
    ).toBeVisible();

    await expect(
      page.getByRole('link', {
        name: /Browse restaurants/i,
      })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: /All Restaurants/i,
      })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: /Recent Orders/i,
      })
    ).toBeVisible();
  });

  test('should open delivery address page', async ({ page }) => {
    await page.getByRole('link', {
      name: /Change/i,
    }).click();

    await expect(page).toHaveURL(/address|profile|customer/i);
  });

  test('should display restaurant cards', async ({ page }) => {
    const restaurantCards = page.locator('[data-testid="restaurant-card"]');

    if (await restaurantCards.count()) {
      await expect(restaurantCards.first()).toBeVisible();
    } else {
      await expect(
        page.getByRole('heading', { name: /All Restaurants/i })
      ).toBeVisible();
    }
  });

  test('should display recent orders section', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        name: /Recent Orders/i,
      })
    ).toBeVisible();

    const emptyState = page.getByText(/No recent orders/i);

    if (await emptyState.count()) {
      await expect(emptyState).toBeVisible();
    }
  });

  test('should not redirect to login when authenticated', async ({ page }) => {
    await expect(page).not.toHaveURL(/login/i);
  });
});