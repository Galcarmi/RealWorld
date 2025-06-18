import {
  MockApiResponse,
  PuppeteerTestHelper,
  VisualTestConfig,
} from '../config/puppeteerConfig';

import { ensureTestDirectories } from './testSetup';
import { VisualComparator, VisualComparisonOptions } from './visualComparison';

interface VisualTestSuiteConfig {
  mockApis?: MockApiResponse[];
  customConfig?: Partial<VisualTestConfig>;
  visualOptions?: Partial<VisualComparisonOptions>;
}

interface VisualRegressionResult {
  diffPercentage: number;
  pixelDifference: number;
  totalPixels: number;
  diffImagePath?: string;
}

export class VisualTestSuite {
  private testHelper: PuppeteerTestHelper | null = null;
  private visualComparator: VisualComparator;

  constructor(private config: VisualTestSuiteConfig = {}) {
    this.visualComparator = new VisualComparator();
  }

  async setupTest(): Promise<PuppeteerTestHelper> {
    const defaultConfig = this.createDefaultConfig();
    const finalConfig: VisualTestConfig = {
      ...defaultConfig,
      ...this.config.customConfig,
      // Ensure we start with only the mocks specified for this test
      mockApis: this.config.mockApis || [],
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

  async takeScreenshotAndCompare(
    screenshotName: string,
    options?: Partial<VisualComparisonOptions>
  ): Promise<void> {
    if (!this.testHelper) {
      throw new Error('Test helper not initialized. Call setupTest() first.');
    }

    // Wait for any animations/transitions to complete
    await this.sleep(2000);

    // Disable animations to ensure consistent screenshots
    const page = this.testHelper.getPage();
    if (page) {
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `,
      });

      // Additional wait after disabling animations
      await this.sleep(500);

      // DEBUG: Capture app state before screenshot
      if (process.env.DEBUG_VISUAL_TESTS === 'true') {
        const debugInfo = await page.evaluate(() => {
          return {
            url: window.location.href,
            loadingElements: document.querySelectorAll(
              '[data-testid*="loading"]'
            ).length,
            errorElements: document.querySelectorAll('[data-testid*="error"]')
              .length,
            validationMessages: document.querySelectorAll(
              '[data-testid*="validation"]'
            ).length,
            emptyStates: document.querySelectorAll('[data-testid*="empty"]')
              .length,
            visibleElements: document.querySelectorAll(
              '[data-testid]:not([style*="display: none"])'
            ).length,
          };
        });
        console.log(`🔍 Debug info for ${screenshotName}:`, debugInfo);
      }
    }

    await this.testHelper.takeScreenshot(screenshotName);

    if (process.env.UPDATE_BASELINES === 'true') {
      this.handleBaselineUpdate(screenshotName);
      return;
    }

    const comparisonOptions = { ...this.config.visualOptions, ...options };
    const result = await this.visualComparator.compareScreenshot(
      screenshotName,
      comparisonOptions
    );

    if (!result.passed) {
      throw this.createVisualRegressionError(screenshotName, result);
    }
  }

  async updateBaseline(screenshotName: string): Promise<void> {
    await this.visualComparator.updateBaseline(screenshotName);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createDefaultConfig(): VisualTestConfig {
    const isHeadless = process.env.HEADLESS === 'true';
    const slowMo = isHeadless ? 0 : 500;

    return {
      headless: isHeadless,
      viewport: { width: 390, height: 844 },
      baseUrl: 'http://localhost:8081',
      slowMo,
      devtools: false,
      mobileMode: true,
      deviceName: 'iPhone 12',
      mockApis: this.config.mockApis || [],
    };
  }

  private handleBaselineUpdate(screenshotName: string): void {
    this.visualComparator.updateBaseline(screenshotName);
  }

  private createVisualRegressionError(
    screenshotName: string,
    result: VisualRegressionResult
  ): Error {
    const errorMessage = [
      `Visual regression detected for "${screenshotName}"!`,
      `Difference: ${result.diffPercentage.toFixed(2)}% (${result.pixelDifference}/${result.totalPixels} pixels)`,
      result.diffImagePath ? `Diff image: ${result.diffImagePath}` : '',
      `To update baseline: yarn test:visual:update-baselines -- --testNamePattern="${screenshotName}"`,
    ]
      .filter(Boolean)
      .join('\n');

    return new Error(errorMessage);
  }
}

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

  async clickAndNavigateToScreen(
    testHelper: PuppeteerTestHelper,
    buttonTestId: string,
    screenTestId: string,
    maxRetries: number = 3
  ): Promise<void> {
    const page = testHelper.getPage();
    if (!page) throw new Error('Page not available');

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `🔄 Attempt ${attempt}/${maxRetries}: Clicking ${buttonTestId} and waiting for ${screenTestId}`
        );

        // Wait for button to be available
        await testHelper.waitForTestId(buttonTestId, 5000);

        // Click the button
        await testHelper.clickByTestId(buttonTestId);

        // Wait for target screen to appear
        await testHelper.waitForTestId(screenTestId, 8000);

        console.log(
          `✅ Successfully navigated to ${screenTestId} on attempt ${attempt}`
        );
        return; // Success!
      } catch (error) {
        lastError = error as Error;
        console.log(`❌ Attempt ${attempt} failed: ${lastError.message}`);

        if (attempt < maxRetries) {
          console.log(`⏳ Waiting 500ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    // If we get here, all attempts failed
    throw new Error(
      `Failed to navigate from ${buttonTestId} to ${screenTestId} after ${maxRetries} attempts. Last error: ${lastError?.message}`
    );
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

export function createVisualTestSuite(
  suiteName: string,
  config: VisualTestSuiteConfig,
  testFn: (suite: VisualTestSuite) => void
): void {
  describe(suiteName, () => {
    const suite = new VisualTestSuite(config);

    beforeEach(async () => {
      ensureTestDirectories();
      await suite.setupTest();
    });

    afterEach(async () => {
      await suite.cleanupTest();
    });

    testFn(suite);
  });
}

export async function performLogin(testHelper: any) {
  await commonTestActions.navigateAndWaitForBody(testHelper);
  await commonTestActions.clickAndNavigateToScreen(
    testHelper,
    'login-tab-icon',
    'login-screen'
  );

  // Wait for all form elements to be available before interacting
  await testHelper.waitForTestId('login-email-input', 5000);
  await testHelper.waitForTestId('login-password-input', 5000);
  await testHelper.waitForTestId('login-submit-button', 5000);

  await testHelper.typeInTestId('login-email-input', 'test@example.com');
  await testHelper.typeInTestId('login-password-input', 'password123');

  await commonTestActions.clickAndNavigateToScreen(
    testHelper,
    'login-submit-button',
    'home-screen'
  );
}

// Helper function to navigate to profile screen with retry logic
export async function navigateToProfile(testHelper: any) {
  await commonTestActions.clickAndNavigateToScreen(
    testHelper,
    'profile-main-tab-icon',
    'profile-screen'
  );
}
