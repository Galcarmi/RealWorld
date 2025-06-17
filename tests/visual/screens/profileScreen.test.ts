import { mockCollections } from '../utils/mockApiResponses';
import { createVisualTestSuite, performLogin } from '../utils/testHelpers';

createVisualTestSuite(
  'Profile Screen - Visual Regression Test',
  { mockApis: mockCollections.userProfile },
  suite => {
    it('should show user profile screen after login', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await testHelper.clickByTestId('profile-main-tab-icon');
      await testHelper.waitForTestId('profile-screen', 10000);
      await testHelper.waitForTestId('edit-profile-button', 5000);
      await testHelper.waitForTestId('new-article-button', 5000);

      await suite.takeScreenshotAndCompare('profile-screen-initial');
    });

    it('should navigate to new article screen', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await testHelper.clickByTestId('profile-main-tab-icon');
      await testHelper.waitForTestId('profile-screen', 10000);
      await testHelper.clickByTestId('new-article-button');

      await testHelper.waitForTestId('new-article-screen', 10000);

      await suite.takeScreenshotAndCompare('new-article-screen-from-profile');
    });
  }
);
