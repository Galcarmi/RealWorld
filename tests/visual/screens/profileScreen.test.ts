import { TEST_IDS } from '../../constants';
import { mockCollections } from '../../mocks/data';
import {
  createVisualTestSuite,
  performLogin,
  navigateToProfile,
  commonTestActions,
} from '../utils/testHelpers';

createVisualTestSuite(
  'Profile Screen - Visual Regression Test',
  { mockApis: mockCollections.allMocks },
  suite => {
    it('should show user profile screen after login', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await navigateToProfile(testHelper);

      await testHelper.waitForTestId(TEST_IDS.EDIT_PROFILE_BUTTON, 5000);
      await testHelper.waitForTestId(TEST_IDS.NEW_ARTICLE_BUTTON, 5000);

      await suite.takeScreenshotAndCompare('profile-screen-initial');
    });

    it('should navigate to new article screen', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await navigateToProfile(testHelper);

      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        TEST_IDS.NEW_ARTICLE_BUTTON,
        TEST_IDS.NEW_ARTICLE_SCREEN
      );

      await suite.takeScreenshotAndCompare('new-article-screen-from-profile');
    });
  }
);
