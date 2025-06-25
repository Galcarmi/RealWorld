import { TEST_IDS } from '../../constants';
import { articleScreenVisualMocks } from '../../mocks/data';
import {
  createVisualTestSuite,
  commonTestActions,
  performLogin,
} from '../utils/testHelpers';

createVisualTestSuite(
  'Article Screen - Visual Regression Test',
  { mockApis: articleScreenVisualMocks },
  suite => {
    it('should display article screen with single comment after login and navigation', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await commonTestActions.waitForArticlesToLoad(testHelper);

      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        `${TEST_IDS.ARTICLE_CARD('visual-test-article')}-content`,
        TEST_IDS.ARTICLE_SCREEN
      );

      await new Promise(resolve => setTimeout(resolve, 2000));

      await suite.takeScreenshotAndCompare(
        'article-screen-with-single-comment'
      );
    });
  }
);
