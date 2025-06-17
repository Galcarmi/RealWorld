import { createVisualTestSuite, commonTestActions } from '../utils/testHelpers';

createVisualTestSuite(
  'Register Tab Icon - Visual Regression Test',
  {},
  suite => {
    it('should match baseline for register tab', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        'register-tab-icon',
        'register-screen'
      );

      await suite.takeScreenshotAndCompare('register-tab-baseline');
    });
  }
);
