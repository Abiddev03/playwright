import { Page, expect } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://qrfy.com/register');
  }

  async fillForm(email: string, password: string) {
    await this.page.getByPlaceholder('name@email.com').fill(email);
    await this.page.getByPlaceholder('Enter your password here...').fill(password);
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Sign up now' }).waitFor({ state: 'attached' });
    await this.page.getByRole('button', { name: 'Sign up now' }).click();
  }

  async assertSuccess() {
    await expect(this.page).toHaveURL(/dashboard/);
  }

  async assertError(message: string) {
    await expect(this.page.locator(`text=${message}`)).toBeVisible();
  }
}
