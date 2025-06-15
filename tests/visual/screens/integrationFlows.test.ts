import { mockCollections } from '../utils/mockApiResponses';
import { createVisualTestSuite, commonTestActions } from '../utils/testHelpers';

async function performLogin(testHelper: any) {
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
}

createVisualTestSuite(
  'Complete User Flow Integration Tests',
  { mockApis: mockCollections.completeIntegration },
  suite => {
    it('should complete flow: login -> articles -> click article -> author profile screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await testHelper.clickByTestId('article-card-test-article-1');
      await testHelper.waitForTestId('author-profile-screen', 10000);

      await suite.takeScreenshotAndCompare(
        'flow-login-articles-author-profile'
      );
    });

    it('should complete flow: login -> articles -> favorite unfavorited article -> screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await testHelper.clickByTestId('favorite-button-authoruser');

      await suite.takeScreenshotAndCompare(
        'flow-login-articles-favorite-unfavorited'
      );
    });

    it('should complete flow: login -> articles -> unfavorite favorited article -> screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await testHelper.clickByTestId('favorite-button-anotheruser');

      await suite.takeScreenshotAndCompare(
        'flow-login-articles-unfavorite-favorited'
      );
    });

    it('should complete flow: login -> user profile -> screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await testHelper.clickByTestId('profile-main-tab-icon');
      await testHelper.waitForTestId('profile-screen', 10000);

      await suite.takeScreenshotAndCompare('flow-login-user-profile');
    });

    it('should complete flow: login -> user profile -> edit profile -> screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await testHelper.clickByTestId('profile-main-tab-icon');
      await testHelper.waitForTestId('profile-screen', 10000);

      await testHelper.clickByTestId('edit-profile-button');
      await testHelper.waitForTestId('edit-profile-screen', 10000);

      await suite.takeScreenshotAndCompare(
        'flow-login-user-profile-edit-profile'
      );
    });

    it('should complete flow: login -> user profile -> new article -> screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await testHelper.clickByTestId('profile-main-tab-icon');
      await testHelper.waitForTestId('profile-screen', 10000);

      await testHelper.clickByTestId('new-article-button');
      await testHelper.waitForTestId('new-article-screen', 10000);

      await suite.takeScreenshotAndCompare(
        'flow-login-user-profile-new-article'
      );
    });
  }
);
