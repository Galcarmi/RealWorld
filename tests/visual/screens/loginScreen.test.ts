import { createVisualTestSuite, commonTestActions } from '../utils/testHelpers';

createVisualTestSuite('Login Screen - Visual Regression Test', {}, suite => {
  it('should match baseline for login screen empty form', async () => {
    const testHelper = suite.getTestHelper();

    await commonTestActions.navigateAndWaitForBody(testHelper);
    await commonTestActions.clickTabAndWaitForScreen(
      testHelper,
      'login-tab-icon',
      'login-screen'
    );

    await testHelper.waitForTestId('login-screen-title', 5000);
    await testHelper.waitForTestId('login-email-input', 5000);
    await testHelper.waitForTestId('login-password-input', 5000);
    await testHelper.waitForTestId('login-submit-button', 5000);
    await testHelper.waitForTestId('login-signup-button', 5000);

    await suite.takeScreenshotAndCompare('login-screen-empty-form');
  });

  it('should match baseline for login screen with filled form', async () => {
    const testHelper = suite.getTestHelper();

    await commonTestActions.navigateAndWaitForBody(testHelper);
    await commonTestActions.clickTabAndWaitForScreen(
      testHelper,
      'login-tab-icon',
      'login-screen'
    );

    await testHelper.typeInTestId('login-email-input', 'test@example.com');
    await testHelper.typeInTestId('login-password-input', 'password123');

    await suite.takeScreenshotAndCompare('login-screen-with-form-data');
  });
});
