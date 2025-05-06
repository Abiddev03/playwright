const { chromium } = require('playwright-extra');
const stealth = require('playwright-extra-plugin-stealth')();

chromium.use(stealth);

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://qrfy.com/register');

    // Fill in the registration form manually or add automation steps
    await page.fill('input[placeholder="name@email.com"]', 'testuser@example.com');
    await page.fill('input[placeholder="Enter your password here..."]', 'Password123!');

    // Wait for you to solve CAPTCHA manually
    console.log('Please solve CAPTCHA manually...');
    await page.waitForTimeout(20000); // Or use `await page.pause();`

    await page.click('button:has-text("Sign up now")');

    // Wait to observe result
    await page.waitForTimeout(5000);

    await browser.close();
})();
