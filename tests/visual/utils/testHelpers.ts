import {
  MockApiResponse,
  PuppeteerTestHelper,
  VisualTestConfig,
} from '../config/puppeteerConfig';

import { ensureTestDirectories } from './testSetup';

interface VisualTestSuiteConfig {
  mockApis?: MockApiResponse[];
  customConfig?: Partial<VisualTestConfig>;
}

export class VisualTestSuite {
  private testHelper: PuppeteerTestHelper | null = null;

  constructor(private config: VisualTestSuiteConfig = {}) {}

  async setupTest(): Promise<PuppeteerTestHelper> {
    const isHeadless = process.env.HEADLESS === 'true';
    const slowMo = isHeadless ? 0 : 500;

    const defaultConfig: VisualTestConfig = {
      headless: isHeadless,
      viewport: { width: 390, height: 844 },
      baseUrl: 'http://localhost:8081',
      slowMo,
      devtools: false,
      mobileMode: true,
      deviceName: 'iPhone 12',
      mockApis: this.config.mockApis || [],
    };

    const finalConfig: VisualTestConfig = {
      ...defaultConfig,
      ...this.config.customConfig,
    };

    this.testHelper = new PuppeteerTestHelper(finalConfig);
    await this.testHelper.init();

    return this.testHelper;
  }

  async cleanupTest(): Promise<void> {
    if (this.testHelper) {
      await this.testHelper.cleanup();
      this.testHelper = null;
    }
  }

  getTestHelper(): PuppeteerTestHelper {
    if (!this.testHelper) {
      throw new Error('Test helper not initialized. Call setupTest() first.');
    }
    return this.testHelper;
  }
}

// Common test utilities
export const commonTestActions = {
  async navigateAndWaitForBody(
    testHelper: PuppeteerTestHelper,
    path: string = '/'
  ): Promise<void> {
    await testHelper.navigateTo(path);

    const page = testHelper.getPage();
    if (!page) throw new Error('Page not available');

    await page.waitForSelector('body', { timeout: 15000 });
  },

  async clickTabAndWaitForScreen(
    testHelper: PuppeteerTestHelper,
    tabTestId: string,
    screenTestId: string
  ): Promise<void> {
    const page = testHelper.getPage();
    if (!page) throw new Error('Page not available');

    const tabSelector = `[data-testid="${tabTestId}"]`;
    await page.waitForSelector(tabSelector, { timeout: 10000 });

    const tab = await page.$(tabSelector);
    if (tab) {
      await tab.click();
    }

    await testHelper.waitForTestId(screenTestId, 10000);
  },

  async waitForArticlesToLoad(testHelper: PuppeteerTestHelper): Promise<void> {
    const page = testHelper.getPage();
    if (!page) throw new Error('Page not available');

    await page.waitForSelector('[data-testid*="article-card"]', {
      timeout: 10000,
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  },
};

// Helper function to create test suite with common setup/teardown
export function createVisualTestSuite(
  suiteName: string,
  config: VisualTestSuiteConfig,
  testFn: (suite: VisualTestSuite) => void
): void {
  describe(suiteName, () => {
    const suite = new VisualTestSuite(config);

    beforeAll(async () => {
      ensureTestDirectories();
      await suite.setupTest();
    });

    afterAll(async () => {
      await suite.cleanupTest();
    });

    testFn(suite);
  });
}
