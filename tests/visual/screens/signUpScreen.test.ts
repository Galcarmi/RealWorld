import { mockCollections } from '../utils/mockApiResponses';
import { createVisualTestSuite, commonTestActions } from '../utils/testHelpers';

createVisualTestSuite(
  'Sign Up Screen - Visual Regression Test',
  { mockApis: mockCollections.authWithRegistration },
  suite => {
    it('should match baseline for signup screen empty form', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        'register-tab-icon',
        'register-screen'
      );

      await testHelper.waitForTestId('signup-screen-title', 5000);
      await testHelper.waitForTestId('signup-username-input', 5000);
      await testHelper.waitForTestId('signup-email-input', 5000);
      await testHelper.waitForTestId('signup-password-input', 5000);
      await testHelper.waitForTestId('signup-submit-button', 5000);
      await testHelper.waitForTestId('signup-signin-button', 5000);

      await suite.takeScreenshotAndCompare('signup-screen-empty-form');
    });

    it('should match baseline for signup screen with filled form', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        'register-tab-icon',
        'register-screen'
      );

      await testHelper.typeInTestId('signup-username-input', 'testuser');
      await testHelper.typeInTestId('signup-email-input', 'test@example.com');
      await testHelper.typeInTestId('signup-password-input', 'password123');

      await suite.takeScreenshotAndCompare('signup-screen-with-form-data');
    });
  }
);
