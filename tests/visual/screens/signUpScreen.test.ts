import { TEST_IDS } from '../../constants';
import { mockCollections } from '../../mocks/data';
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
        TEST_IDS.SIGNUP_SCREEN
      );

      await testHelper.waitForTestId('auth-screen-title', 5000);
      await testHelper.waitForTestId('auth-username-input', 5000);
      await testHelper.waitForTestId('auth-email-input', 5000);
      await testHelper.waitForTestId('auth-password-input', 5000);
      await testHelper.waitForTestId('auth-submit-button', 5000);
      await testHelper.waitForTestId('auth-signin-button', 5000);

      await suite.takeScreenshotAndCompare('signup-screen-empty-form');
    });

    it('should match baseline for signup screen with filled form', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        'register-tab-icon',
        TEST_IDS.SIGNUP_SCREEN
      );

      await testHelper.typeInTestId('auth-username-input', 'testuser');
      await testHelper.typeInTestId('auth-email-input', 'test@example.com');
      await testHelper.typeInTestId('auth-password-input', 'password123');

      await suite.takeScreenshotAndCompare('signup-screen-with-form-data');
    });
  }
);
