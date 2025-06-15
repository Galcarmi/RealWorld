import { mockCollections } from '../utils/mockApiResponses';
import { createVisualTestSuite, commonTestActions } from '../utils/testHelpers';

createVisualTestSuite(
  'New Article Screen - Visual Regression Test',
  { mockApis: mockCollections.newArticle },
  suite => {
    it('should show new article screen with empty form', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickTabAndWaitForScreen(
        testHelper,
        'login-tab-icon',
        'login-screen'
      );

      await testHelper.typeInTestId('login-email-input', 'test@example.com');
      await testHelper.typeInTestId('login-password-input', 'password123');
      await testHelper.clickByTestId('login-submit-button');

      await testHelper.waitForTestId('home-screen', 10000);

      await testHelper.clickByTestId('profile-main-tab-icon');
      await testHelper.waitForTestId('profile-screen', 10000);
      await testHelper.clickByTestId('new-article-button');

      await testHelper.waitForTestId('new-article-screen', 10000);

      const page2 = testHelper.getPage();
      if (!page2) throw new Error('Page not available');

      await page2.waitForSelector('[data-testid*="article-title-input"]', {
        timeout: 5000,
      });
      await page2.waitForSelector(
        '[data-testid*="article-description-input"]',
        { timeout: 5000 }
      );
      await page2.waitForSelector('[data-testid*="article-body-input"]', {
        timeout: 5000,
      });
      await page2.waitForSelector('[data-testid*="publish-article-button"]', {
        timeout: 5000,
      });

      await suite.takeScreenshotAndCompare('new-article-screen-empty-form');
    });

    it('should show new article screen with filled form data', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickTabAndWaitForScreen(
        testHelper,
        'login-tab-icon',
        'login-screen'
      );

      await testHelper.typeInTestId('login-email-input', 'test@example.com');
      await testHelper.typeInTestId('login-password-input', 'password123');
      await testHelper.clickByTestId('login-submit-button');

      await testHelper.waitForTestId('home-screen', 10000);

      await testHelper.clickByTestId('profile-main-tab-icon');
      await testHelper.waitForTestId('profile-screen', 10000);
      await testHelper.clickByTestId('new-article-button');

      await testHelper.waitForTestId('new-article-screen', 10000);

      const page2 = testHelper.getPage();
      if (!page2) throw new Error('Page not available');

      await page2.evaluate(() => {
        const titleInput = document.querySelector(
          '[data-testid*="article-title-input"] input'
        ) as HTMLInputElement;
        const descriptionInput = document.querySelector(
          '[data-testid*="article-description-input"] input'
        ) as HTMLInputElement;
        const bodyInput = document.querySelector(
          '[data-testid*="article-body-input"] textarea'
        ) as HTMLTextAreaElement;

        if (titleInput) {
          titleInput.value = 'New Test Article';
          titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          titleInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (descriptionInput) {
          descriptionInput.value = 'This is a new test article description';
          descriptionInput.dispatchEvent(new Event('input', { bubbles: true }));
          descriptionInput.dispatchEvent(
            new Event('change', { bubbles: true })
          );
        }

        if (bodyInput) {
          bodyInput.value =
            'This is the body content of the new test article. It contains detailed information about the topic.';
          bodyInput.dispatchEvent(new Event('input', { bubbles: true }));
          bodyInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      await suite.takeScreenshotAndCompare('new-article-screen-with-form-data');
    });
  }
);
