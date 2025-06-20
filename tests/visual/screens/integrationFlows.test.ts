import { TEST_IDS } from '../../constants';
import { mockCollections } from '../../mocks/data';
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
        TEST_IDS.AUTHOR_PROFILE_SCREEN
      );

      await suite.takeScreenshotAndCompare(
        'flow-login-articles-author-profile'
      );
    });

    it('should complete flow: login -> articles -> favorite unfavorited article -> screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await testHelper.clickByTestId('favorite-button-testuser1');

      await suite.takeScreenshotAndCompare(
        'flow-login-articles-favorite-unfavorited'
      );
    });

    it('should complete flow: login -> articles -> unfavorite favorited article -> screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await testHelper.clickByTestId('favorite-button-testuser2');

      await suite.takeScreenshotAndCompare(
        'flow-login-articles-unfavorite-favorited'
      );
    });

    it('should complete flow: login -> profile -> screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await navigateToProfile(testHelper);

      await suite.takeScreenshotAndCompare('flow-login-user-profile');
    });

    it('should complete flow: login -> profile -> edit profile -> screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await navigateToProfile(testHelper);

      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        TEST_IDS.EDIT_PROFILE_BUTTON,
        TEST_IDS.EDIT_PROFILE_SCREEN
      );

      await suite.takeScreenshotAndCompare(
        'flow-login-user-profile-edit-profile'
      );
    });

    it('should complete flow: login -> profile -> new article -> screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await navigateToProfile(testHelper);

      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        TEST_IDS.NEW_ARTICLE_BUTTON,
        TEST_IDS.NEW_ARTICLE_SCREEN
      );

      await suite.takeScreenshotAndCompare(
        'flow-login-user-profile-new-article'
      );
    });
  }
);
