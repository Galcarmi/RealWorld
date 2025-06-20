import { TEST_IDS } from '../../constants';
import { visualTestMockCollections } from '../../mocks/data';
import { createVisualTestSuite, commonTestActions } from '../utils/testHelpers';

createVisualTestSuite(
  'Home Screen - Visual Regression Test',
  {
    mockApis: visualTestMockCollections.homeScreen,
  },
  suite => {
    it('should match baseline for home screen with articles', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        TEST_IDS.HOME_TAB_ICON,
        TEST_IDS.HOME_SCREEN
      );
      await commonTestActions.waitForArticlesToLoad(testHelper);

      await suite.takeScreenshotAndCompare('home-screen-with-articles');
    });
  }
);
