import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { generateCredentials } from '../utils/faker';
import { allure } from 'allure-playwright';
import fs from 'fs';

test.describe('Qrfy Registration Tests', () => {
  test('should register a new user successfully with CAPTCHA detection', async ({ page, context }, testInfo) => {
    const register = new RegisterPage(page);
    const { email, password } = generateCredentials();

    await register.goto();
    await register.fillForm(email, password);

    const captcha = page.locator('//*[@id="cf-turnstile-widget"]');
    await page.waitForTimeout(2000);

    if (await captcha.isVisible({ timeout: 20000 })) {
      const screenshot = await page.screenshot();
      allure.attachment('CAPTCHA Screenshot', screenshot, 'image/png');

      await page.pause();
      testInfo.skip(true, 'CAPTCHA detected – skipping test.');
      await page.close();
      await context.close();

    
      const videoPath = testInfo.attachments.find(a => a.name === 'video')?.path;
      if (videoPath && fs.existsSync(videoPath)) {
        const videoBuffer = fs.readFileSync(videoPath);
        allure.attachment('CAPTCHA Video', videoBuffer, 'video/webm');
      }

      return;
    }

    await register.submit();
    await register.assertSuccess();
  });

  test('should show error on already used email', async ({ page, context }, testInfo) => {
    const register = new RegisterPage(page);
    const reusedEmail = 'abid@yopmail.com';
    const password = 'Test@123';

    await register.goto();
    await register.fillForm(reusedEmail, password);

    const captcha = page.locator('//*[@id="cf-turnstile-widget"]');
    await page.waitForTimeout(2000);

    if (await captcha.isVisible({ timeout: 20000 })) {
      const screenshot = await page.screenshot();
      allure.attachment('CAPTCHA Screenshot', screenshot, 'image/png');
      testInfo.skip(true, 'CAPTCHA detected – skipping test.');
      await page.close();
      await context.close();

      
      const videoPath = testInfo.attachments.find(a => a.name === 'video')?.path;
      if (videoPath && fs.existsSync(videoPath)) {
        const videoBuffer = fs.readFileSync(videoPath);
        allure.attachment('CAPTCHA Video', videoBuffer, 'video/webm');
      }

      return;
    }

    await register.submit();
    await register.assertError('Email already exists');
  });
});
