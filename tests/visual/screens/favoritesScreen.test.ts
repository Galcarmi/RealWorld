import { mockCollections } from '../utils/mockApiResponses';
import { createVisualTestSuite, commonTestActions } from '../utils/testHelpers';

createVisualTestSuite(
  'Favorites Screen - Visual Regression Test',
  { mockApis: mockCollections.favorites },
  suite => {
    it('should show favorites screen with favorited articles', async () => {
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

      await testHelper.clickByTestId('favorites-main-tab-icon');
      await testHelper.waitForTestId('favorites-screen', 10000);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await suite.takeScreenshotAndCompare('favorites-screen-with-articles');
    });

    it('should favorite an unfavorited article from home screen', async () => {
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

      await testHelper.clickByTestId('favorite-button-authoruser');

      await suite.takeScreenshotAndCompare('home-screen-article-favorited');
    });

    it('should unfavorite a favorited article from home screen', async () => {
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

      await testHelper.clickByTestId('favorite-button-anotheruser');

      await suite.takeScreenshotAndCompare('home-screen-article-unfavorited');
    });
  }
);
