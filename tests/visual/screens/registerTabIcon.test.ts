import { createVisualTestSuite, commonTestActions } from '../utils/testHelpers';

createVisualTestSuite(
  'Register Tab Icon - Baseline Snapshot',
  {}, // No mock APIs needed for register tab
  suite => {
    it('should create baseline snapshot for register tab', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickTabAndWaitForScreen(testHelper, 'register-tab-icon', 'register-screen');

      await testHelper.takeScreenshot('register-tab-baseline');
    });
  }
);
