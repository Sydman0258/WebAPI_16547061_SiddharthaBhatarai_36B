import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function fillLoginForm(page: Page, email: string, password: string) {
  await page.getByPlaceholder('name@example.com').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
}

test.describe('Login Page', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear cookies before each test to ensure a clean unauthenticated state
    await context.clearCookies();
    await page.goto(`${BASE_URL}/login`);
  });

  test('renders the login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('.error_message').first()).toBeVisible();
  });

  test('toggles password visibility', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('••••••••');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await page.getByLabel('Show password').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    await page.getByLabel('Hide password').click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('navigates to the register page', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Create an account' }).click();
    await expect(page).toHaveURL(/\/register\/?$/);
  });

  test('navigates to the forgot password page', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Forgot Password?' }).click();
    await expect(page).toHaveURL(/\/forgot_password\/?$/);
  });
});