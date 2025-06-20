import { TEST_IDS } from '../../constants';
import { mockCollections } from '../../mocks/data';
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
        TEST_IDS.ARTICLE_CARD('test-article-1'),
        TEST_IDS.AUTHOR_PROFILE_SCREEN
      );

      await suite.takeScreenshotAndCompare('author-profile-screen-initial');
    });

    it('should show follow button and toggle to unfollow', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        TEST_IDS.ARTICLE_CARD('test-article-1'),
        TEST_IDS.AUTHOR_PROFILE_SCREEN
      );
      await testHelper.waitForTestId(TEST_IDS.FOLLOW_BUTTON, 5000);

      await testHelper.clickByTestId(TEST_IDS.FOLLOW_BUTTON);
      await testHelper.waitForTestId(TEST_IDS.UNFOLLOW_BUTTON, 5000);

      await suite.takeScreenshotAndCompare('author-profile-screen-followed');
    });
  }
);
