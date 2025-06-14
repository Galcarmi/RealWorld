import { createVisualTestSuite, commonTestActions } from '../utils/testHelpers';

createVisualTestSuite(
  'Login Screen - Visual Regression Test',
  {}, // No mock APIs needed for login screen
  suite => {
    it('should create baseline snapshot for login screen', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickTabAndWaitForScreen(
        testHelper,
        'login-tab-icon',
        'login-screen'
      );

      // Wait for key elements to be visible
      await testHelper.waitForTestId('login-screen-title', 5000);
      await testHelper.waitForTestId('login-email-input', 5000);
      await testHelper.waitForTestId('login-password-input', 5000);
      await testHelper.waitForTestId('login-submit-button', 5000);
      await testHelper.waitForTestId('login-signup-button', 5000);

      await testHelper.takeScreenshot('login-screen-baseline');
    });

    it('should create snapshot with form interaction', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickTabAndWaitForScreen(
        testHelper,
        'login-tab-icon',
        'login-screen'
      );

      // Fill in some test data to show form state
      await testHelper.typeInTestId('login-email-input', 'test@example.com');
      await testHelper.typeInTestId('login-password-input', 'password123');

      await testHelper.takeScreenshot('login-screen-with-form-data');
    });
  }
);
