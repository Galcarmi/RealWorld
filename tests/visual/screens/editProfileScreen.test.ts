import { mockCollections } from '../utils/mockApiResponses';
import { createVisualTestSuite, commonTestActions } from '../utils/testHelpers';

createVisualTestSuite(
  'Edit Profile Screen - Visual Regression Test',
  { mockApis: mockCollections.editProfile },
  suite => {
    it('should show edit profile screen with current user data', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickTabAndWaitForScreen(
        testHelper,
        'login-tab-icon',
        'login-screen'
      );

      await testHelper.typeInTestId('login-email-input', 'test@example.com');
      await testHelper.typeInTestId('login-password-input', 'password123');
      await testHelper.clickByTestId('login-submit-button');

      await testHelper.waitForTestId('home-screen', 10000);

      await testHelper.clickByTestId('profile-main-tab-icon');
      await testHelper.waitForTestId('profile-screen', 10000);
      await testHelper.clickByTestId('edit-profile-button');

      await testHelper.waitForTestId('edit-profile-screen', 10000);

      await suite.takeScreenshotAndCompare('edit-profile-screen-initial');
    });

    it('should show edit profile screen with updated form data', async () => {
      const testHelper = suite.getTestHelper();

      await commonTestActions.navigateAndWaitForBody(testHelper);
      await commonTestActions.clickTabAndWaitForScreen(
        testHelper,
        'login-tab-icon',
        'login-screen'
      );

      await testHelper.typeInTestId('login-email-input', 'test@example.com');
      await testHelper.typeInTestId('login-password-input', 'password123');
      await testHelper.clickByTestId('login-submit-button');

      await testHelper.waitForTestId('home-screen', 10000);

      await testHelper.clickByTestId('profile-main-tab-icon');
      await testHelper.waitForTestId('profile-screen', 10000);
      await testHelper.clickByTestId('edit-profile-button');

      await testHelper.waitForTestId('edit-profile-screen', 10000);

      const page2 = testHelper.getPage();
      if (!page2) throw new Error('Page not available');

      await page2.evaluate(() => {
        const imageInput = document.querySelector(
          '[data-testid="edit-profile-image-input"] input'
        ) as HTMLInputElement;
        const usernameInput = document.querySelector(
          '[data-testid="edit-profile-username-input"] input'
        ) as HTMLInputElement;
        const bioInput = document.querySelector(
          '[data-testid="edit-profile-bio-input"] input'
        ) as HTMLInputElement;
        const emailInput = document.querySelector(
          '[data-testid="edit-profile-email-input"] input'
        ) as HTMLInputElement;

        if (imageInput) imageInput.value = 'https://example.com/avatar.jpg';
        if (usernameInput) usernameInput.value = 'updateduser';
        if (bioInput) bioInput.value = 'Updated bio content';
        if (emailInput) emailInput.value = 'updated@example.com';

        [imageInput, usernameInput, bioInput, emailInput].forEach(input => {
          if (input) {
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      });

      await suite.takeScreenshotAndCompare('edit-profile-screen-with-updates');
    });
  }
);
