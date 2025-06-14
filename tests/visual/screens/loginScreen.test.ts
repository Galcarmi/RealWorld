import { PuppeteerTestHelper } from '../config/puppeteerConfig';

describe('Login Screen - Visual Regression Test', () => {
  let testHelper: PuppeteerTestHelper;

  beforeAll(async () => {
    const isHeadless = process.env.HEADLESS === 'true';
    const slowMo = isHeadless ? 0 : 500;

    testHelper = new PuppeteerTestHelper({
      headless: isHeadless,
      viewport: { width: 390, height: 844 },
      baseUrl: 'http://localhost:8081',
      slowMo,
      devtools: false,
      mobileMode: true,
      deviceName: 'iPhone 12',
    });
    await testHelper.init();
  });

  afterAll(async () => {
    await testHelper.cleanup();
  });

  it('should create baseline snapshot for login screen', async () => {
    await testHelper.navigateTo('/');

    const page = testHelper.getPage();
    if (!page) throw new Error('Page not available');

    await page.waitForSelector('body', { timeout: 15000 });

    // Click on the login tab first
    const loginTabSelector = '[data-testid="login-tab-icon"]';
    await page.waitForSelector(loginTabSelector, { timeout: 10000 });

    const loginTab = await page.$(loginTabSelector);
    if (loginTab) {
      await loginTab.click();
    }

    // Wait for the login screen to load
    await testHelper.waitForTestId('login-screen', 10000);

    // Wait for key elements to be visible
    await testHelper.waitForTestId('login-screen-title', 5000);
    await testHelper.waitForTestId('login-email-input', 5000);
    await testHelper.waitForTestId('login-password-input', 5000);
    await testHelper.waitForTestId('login-submit-button', 5000);
    await testHelper.waitForTestId('login-signup-button', 5000);

    // Take screenshot of the complete login screen
    await testHelper.takeScreenshot('login-screen-baseline');
  });

  it('should create snapshot with form interaction', async () => {
    await testHelper.navigateTo('/');

    const page = testHelper.getPage();
    if (!page) throw new Error('Page not available');

    await page.waitForSelector('body', { timeout: 15000 });

    // Click on the login tab first
    const loginTabSelector = '[data-testid="login-tab-icon"]';
    await page.waitForSelector(loginTabSelector, { timeout: 10000 });

    const loginTab = await page.$(loginTabSelector);
    if (loginTab) {
      await loginTab.click();
    }

    await testHelper.waitForTestId('login-screen', 10000);

    // Fill in some test data to show form state
    await testHelper.typeInTestId('login-email-input', 'test@example.com');
    await testHelper.typeInTestId('login-password-input', 'password123');

    // Take screenshot with filled form
    await testHelper.takeScreenshot('login-screen-with-form-data');
  });
}); 