import { test, expect, Page, Locator } from '@playwright/test';

test.use({
  storageState: undefined,
});
const REGISTER_PATH = '/register';

const validUser = {
  fullname: 'Jane Doe',
  username: 'janedoe123',
  email: 'jane.doe@example.com',
  phoneNumber: '9876543210',
  password: 'StrongP@ssw0rd!',
  confirmpassword: 'StrongP@ssw0rd!',
};

// Fixed DOM order of `.reg_form_group.full_width` blocks in the form.
const FIELD_INDEX = {
  fullname: 0,
  username: 1,
  email: 2,
  phoneNumber: 3,
  password: 4,
  confirmpassword: 5,
  role: 6,
} as const;

function fieldGroup(page: Page, key: keyof typeof FIELD_INDEX): Locator {
  return page.locator('.reg_form_group.full_width').nth(FIELD_INDEX[key]);
}

function fieldInput(page: Page, key: keyof typeof FIELD_INDEX): Locator {
  return fieldGroup(page, key).locator('input, select');
}

async function fillRegistrationForm(page: Page, overrides: Partial<typeof validUser> = {}) {
  const data = { ...validUser, ...overrides };

  await fieldInput(page, 'fullname').fill(data.fullname);
  await fieldInput(page, 'username').fill(data.username);
  await fieldInput(page, 'email').fill(data.email);
  await fieldInput(page, 'phoneNumber').fill(data.phoneNumber);
  await fieldInput(page, 'password').fill(data.password);
  await fieldInput(page, 'confirmpassword').fill(data.confirmpassword);
  await fieldInput(page, 'role').selectOption('customer');
  await page.locator('.checkbox_container input[type="checkbox"]').check();
}

const REGISTER_API_PATTERN = /regist/i;

async function mockRegisterApi(
  page: Page,
  body: Record<string, unknown>,
  status = 200
) {
  await page.route('**/*', async (route) => {
    const request = route.request();
    if (request.method() === 'POST' && REGISTER_API_PATTERN.test(request.url())) {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
      return;
    }
    await route.continue();
  });
}

test.describe('Registration page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(REGISTER_PATH);
  });

  test('renders the registration form with all expected fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
    await expect(page.getByText('Start your journey with GrubGO.')).toBeVisible();

    await expect(fieldInput(page, 'fullname')).toBeVisible();
    await expect(fieldInput(page, 'username')).toBeVisible();
    await expect(fieldInput(page, 'email')).toBeVisible();
    await expect(fieldInput(page, 'phoneNumber')).toBeVisible();
    await expect(fieldInput(page, 'password')).toBeVisible();
    await expect(fieldInput(page, 'confirmpassword')).toBeVisible();
    await expect(fieldInput(page, 'role')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'GrubGO' })).toHaveAttribute('href', '/');
  });

  test('toggles password and confirm-password visibility independently', async ({ page }) => {
    const passwordInput = fieldInput(page, 'password');
    const confirmInput = fieldInput(page, 'confirmpassword');

    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(confirmInput).toHaveAttribute('type', 'password');

    await fieldGroup(page, 'password').locator('.password_toggle_btn').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(confirmInput).toHaveAttribute('type', 'password');

    await fieldGroup(page, 'confirmpassword').locator('.password_toggle_btn').click();
    await expect(confirmInput).toHaveAttribute('type', 'text');
  });

  test('shows a validation error when passwords do not match', async ({ page }) => {
    await fillRegistrationForm(page, { confirmpassword: 'SomethingDifferent1!' });
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Adjust the expected copy to match your zod schema's actual message.
    await expect(fieldGroup(page, 'confirmpassword').locator('.error_message')).toBeVisible();
  });


  test('requires the terms checkbox before the browser allows submission', async ({ page }) => {
    await fillRegistrationForm(page);
    const checkbox = page.locator('.checkbox_container input[type="checkbox"]');
    await checkbox.uncheck();

    await page.getByRole('button', { name: 'Sign up' }).click();

    // Native HTML5 validation should block submission and keep us on the page.
    await expect(page).toHaveURL(new RegExp(REGISTER_PATH));
    await expect(checkbox).toHaveJSProperty('validity.valid', false);
  });


 
});