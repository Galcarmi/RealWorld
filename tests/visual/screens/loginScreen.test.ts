import { TEST_IDS } from '../../constants';
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
        TEST_IDS.LOGIN_TAB_ICON,
        TEST_IDS.SIGNIN_SCREEN
      );

      await testHelper.waitForTestId(TEST_IDS.AUTH_SCREEN_TITLE, 5000);
      await testHelper.waitForTestId(TEST_IDS.AUTH_EMAIL_INPUT, 5000);
      await testHelper.waitForTestId(TEST_IDS.AUTH_PASSWORD_INPUT, 5000);
      await testHelper.waitForTestId(TEST_IDS.AUTH_SUBMIT_BUTTON, 5000);
      await testHelper.waitForTestId(TEST_IDS.AUTH_SIGNUP_BUTTON, 5000);

      await suite.takeScreenshotAndCompare('signin-screen-empty-form');
    });

    it('should match baseline for login screen with filled form', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        TEST_IDS.LOGIN_TAB_ICON,
        TEST_IDS.SIGNIN_SCREEN
      );

      await testHelper.typeInTestId(
        TEST_IDS.AUTH_EMAIL_INPUT,
        'test@example.com'
      );
      await testHelper.typeInTestId(
        TEST_IDS.AUTH_PASSWORD_INPUT,
        'password123'
      );

      await suite.takeScreenshotAndCompare('signin-screen-with-form-data');
    });
  }
);
