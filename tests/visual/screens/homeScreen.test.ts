import { mockApiResponses } from '../utils/mockData';
import {
  createVisualTestSuite,
  commonTestActions,
  VisualTestSuite,
} from '../utils/testHelpers';

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
      await testHelper.waitForTestId('home-screen', 10000);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await suite.takeScreenshotAndCompare('home-screen-with-articles');
    });

    it('should match baseline for home screen loading state', async () => {
      const loadingSuite = new VisualTestSuite({
        mockApis: [
          {
            url: /node-express-conduit\.appspot\.com\/api\/articles(\?.*)?$/,
            method: 'GET',
            status: 200,
            contentType: 'application/json',
            body: mockApiResponses.articles,
            delay: 3000,
          },
        ],
        // Default visual options are automatically applied by VisualTestSuite
      });

      const loadingTestHelper = await loadingSuite.setupTest();

      try {
        await commonTestActions.navigateAndWaitForBody(loadingTestHelper);
        await loadingTestHelper.waitForTestId('home-screen', 10000);

        await loadingSuite.takeScreenshotAndCompare(
          'home-screen-loading-state'
        );

        await commonTestActions.waitForArticlesToLoad(loadingTestHelper);
      } finally {
        await loadingSuite.cleanupTest();
      }
    });
  }
);
