import { mockCollections } from '../utils/mockApiResponses';
import {
  createVisualTestSuite,
  commonTestActions,
  performLogin,
  navigateToProfile,
} from '../utils/testHelpers';

createVisualTestSuite(
  'Complete User Flow Integration Tests',
  { mockApis: mockCollections.completeIntegration },
  suite => {
    it('should complete flow: login -> articles -> click article -> author profile screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        'article-card-test-article-1',
        'author-profile-screen'
      );

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

      await navigateToProfile(testHelper);

      await suite.takeScreenshotAndCompare('flow-login-user-profile');
    });

    it('should complete flow: login -> user profile -> edit profile -> screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await navigateToProfile(testHelper);

      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        'edit-profile-button',
        'edit-profile-screen'
      );

      await suite.takeScreenshotAndCompare(
        'flow-login-user-profile-edit-profile'
      );
    });

    it('should complete flow: login -> user profile -> new article -> screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await navigateToProfile(testHelper);

      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        'new-article-button',
        'new-article-screen'
      );

      await suite.takeScreenshotAndCompare(
        'flow-login-user-profile-new-article'
      );
    });
  }
);
