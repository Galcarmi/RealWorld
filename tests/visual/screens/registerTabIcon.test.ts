import { PuppeteerTestHelper } from '../config/puppeteerConfig';

describe('Register Tab Icon - Baseline Snapshot', () => {
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

  it('should create baseline snapshot for register tab', async () => {
    await testHelper.navigateTo('/');

    const page = testHelper.getPage();
    if (!page) throw new Error('Page not available');

    await page.waitForSelector('body', { timeout: 15000 });

    const registerTabSelector = '[data-testid="register-tab-icon"]';
    await page.waitForSelector(registerTabSelector, { timeout: 10000 });

    const registerTab = await page.$(registerTabSelector);
    if (registerTab) {
      await registerTab.click();
    }

    await testHelper.takeScreenshot('register-tab-baseline');
  });
});
