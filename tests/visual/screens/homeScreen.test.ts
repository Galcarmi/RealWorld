import { mockApiResponses } from '../utils/mockData';
import { createVisualTestSuite, commonTestActions } from '../utils/testHelpers';

createVisualTestSuite(
  'Home Screen - Visual Regression Test',
  {
    mockApis: [
      {
        url: /node-express-conduit\.appspot\.com\/api\/articles(\?.*)?$/,
        method: 'GET',
        status: 200,
        contentType: 'application/json',
        body: mockApiResponses.articles,
        delay: 500,
      },
      {
        url: /node-express-conduit\.appspot\.com\/api\/articles\/feed(\?.*)?$/,
        method: 'GET',
        status: 200,
        contentType: 'application/json',
        body: mockApiResponses.articles,
        delay: 500,
      },
    ],
  },
  suite => {
    it('should match baseline for home screen with articles', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        'home-tab-icon',
        'home-screen'
      );
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await suite.takeScreenshotAndCompare('home-screen-with-articles');
    });
  }
);
