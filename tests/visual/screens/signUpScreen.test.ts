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
        TEST_IDS.REGISTER_TAB_ICON,
        TEST_IDS.SIGNUP_SCREEN
      );

      await testHelper.waitForTestId(TEST_IDS.AUTH_SCREEN_TITLE, 5000);
      await testHelper.waitForTestId(TEST_IDS.AUTH_USERNAME_INPUT, 5000);
      await testHelper.waitForTestId(TEST_IDS.AUTH_EMAIL_INPUT, 5000);
      await testHelper.waitForTestId(TEST_IDS.AUTH_PASSWORD_INPUT, 5000);
      await testHelper.waitForTestId(TEST_IDS.AUTH_SUBMIT_BUTTON, 5000);
      await testHelper.waitForTestId(TEST_IDS.AUTH_SIGNIN_BUTTON, 5000);

      await suite.takeScreenshotAndCompare('signup-screen-empty-form');
    });

    it('should match baseline for signup screen with filled form', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        TEST_IDS.REGISTER_TAB_ICON,
        TEST_IDS.SIGNUP_SCREEN
      );

      await testHelper.typeInTestId(TEST_IDS.AUTH_USERNAME_INPUT, 'testuser');
      await testHelper.typeInTestId(
        TEST_IDS.AUTH_EMAIL_INPUT,
        'test@example.com'
      );
      await testHelper.typeInTestId(
        TEST_IDS.AUTH_PASSWORD_INPUT,
        'password123'
      );

      await suite.takeScreenshotAndCompare('signup-screen-with-form-data');
    });
  }
);
