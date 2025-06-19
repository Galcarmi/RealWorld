import { visualTestMockCollections } from '../../mocks/data';
import { createVisualTestSuite, commonTestActions } from '../utils/testHelpers';

createVisualTestSuite(
  'Login Screen - Visual Regression Test',
  { mockApis: visualTestMockCollections.emptyMocks },
  suite => {
    it('should match baseline for login screen empty form', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        'login-tab-icon',
        'login-screen'
      );

      await testHelper.waitForTestId('auth-screen-title', 5000);
      await testHelper.waitForTestId('auth-email-input', 5000);
      await testHelper.waitForTestId('auth-password-input', 5000);
      await testHelper.waitForTestId('auth-submit-button', 5000);
      await testHelper.waitForTestId('auth-signup-button', 5000);

      await suite.takeScreenshotAndCompare('login-screen-empty-form');
    });

    it('should match baseline for login screen with filled form', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        'login-tab-icon',
        'login-screen'
      );

      await testHelper.typeInTestId('auth-email-input', 'test@example.com');
      await testHelper.typeInTestId('auth-password-input', 'password123');

      await suite.takeScreenshotAndCompare('login-screen-with-form-data');
    });
  }
);
