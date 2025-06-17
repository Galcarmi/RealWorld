import { mockCollections } from '../utils/mockApiResponses';
import {
  createVisualTestSuite,
  commonTestActions,
  performLogin,
} from '../utils/testHelpers';

createVisualTestSuite(
  'Author Profile Screen - Visual Regression Test',
  { mockApis: mockCollections.authorProfile },
  suite => {
    it('should navigate to author profile from article and take screenshot', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        'article-card-test-article-1',
        'author-profile-screen'
      );

      await suite.takeScreenshotAndCompare('author-profile-screen-initial');
    });

    it('should show follow button and toggle to unfollow', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        'article-card-test-article-1',
        'author-profile-screen'
      );
      await testHelper.waitForTestId('follow-button', 5000);

      await testHelper.clickByTestId('follow-button');
      await testHelper.waitForTestId('unfollow-button', 5000);

      await suite.takeScreenshotAndCompare('author-profile-screen-followed');
    });
  }
);
