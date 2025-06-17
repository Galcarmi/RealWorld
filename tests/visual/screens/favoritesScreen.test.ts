import { mockCollections } from '../utils/mockApiResponses';
import {
  createVisualTestSuite,
  commonTestActions,
  performLogin,
} from '../utils/testHelpers';

createVisualTestSuite(
  'Favorites Screen - Visual Regression Test',
  { mockApis: mockCollections.favorites },
  suite => {
    it('should show favorites screen with favorited articles', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await testHelper.clickByTestId('favorites-main-tab-icon');
      await testHelper.waitForTestId('favorites-screen', 10000);
      await testHelper.waitForTestId('article-card-favorited-article', 5000);

      await suite.takeScreenshotAndCompare(
        'favorites-screen-with-favorited-articles'
      );
    });

    it('should favorite an unfavorited article from home screen', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await testHelper.clickByTestId('favorite-button-authoruser');

      await suite.takeScreenshotAndCompare('home-screen-article-favorited');
    });

    it('should unfavorite a favorited article from home screen', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await testHelper.clickByTestId('favorite-button-anotheruser');

      await suite.takeScreenshotAndCompare('home-screen-article-unfavorited');
    });
  }
);
