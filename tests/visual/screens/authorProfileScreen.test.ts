import { mockCollections } from '../utils/mockApiResponses';
import { createVisualTestSuite, commonTestActions } from '../utils/testHelpers';

createVisualTestSuite(
  'Author Profile Screen - Visual Regression Test',
  { mockApis: mockCollections.authorProfile },
  suite => {
    it('should navigate to author profile from article and take screenshot', async () => {
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
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await testHelper.clickByTestId('article-card-test-article-1');
      await testHelper.waitForTestId('author-profile-screen', 10000);

      await suite.takeScreenshotAndCompare('author-profile-screen-initial');
    });

    it('should show follow button and toggle to unfollow', async () => {
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
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await testHelper.clickByTestId('article-card-test-article-1');
      await testHelper.waitForTestId('author-profile-screen', 10000);
      await testHelper.waitForTestId('follow-button', 5000);

      await testHelper.clickByTestId('follow-button');
      await testHelper.waitForTestId('unfollow-button', 5000);

      await suite.takeScreenshotAndCompare('author-profile-screen-followed');
    });
  }
);
