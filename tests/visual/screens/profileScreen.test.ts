import { mockCollections } from '../utils/mockApiResponses';
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

      await testHelper.waitForTestId('edit-profile-button', 5000);
      await testHelper.waitForTestId('new-article-button', 5000);

      await suite.takeScreenshotAndCompare('profile-screen-initial');
    });

    it('should navigate to new article screen', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await navigateToProfile(testHelper);

      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        'new-article-button',
        'new-article-screen'
      );

      await suite.takeScreenshotAndCompare('new-article-screen-from-profile');
    });
  }
);
