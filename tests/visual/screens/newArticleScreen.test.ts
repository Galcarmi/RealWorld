import { TEST_IDS } from '../../constants';
import { mockCollections } from '../../mocks/data';
import {
  createVisualTestSuite,
  performLogin,
  navigateToProfile,
  commonTestActions,
} from '../utils/testHelpers';
createVisualTestSuite(
  'New Article Screen - Visual Regression Test',
  { mockApis: mockCollections.newArticle },
  suite => {
    it('should show new article screen with empty form', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await navigateToProfile(testHelper);

      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        TEST_IDS.NEW_ARTICLE_BUTTON,
        TEST_IDS.NEW_ARTICLE_SCREEN
      );

      await testHelper.waitForTestId(TEST_IDS.ARTICLE_TITLE_INPUT, 5000);
      await testHelper.waitForTestId(TEST_IDS.ARTICLE_DESCRIPTION_INPUT, 5000);
      await testHelper.waitForTestId(TEST_IDS.ARTICLE_BODY_INPUT, 5000);
      await testHelper.waitForTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON, 5000);

      await suite.takeScreenshotAndCompare('new-article-screen-empty-form');
    });

    it('should show new article screen with filled form data', async () => {
      const testHelper = suite.getTestHelper();

      await performLogin(testHelper);

      await navigateToProfile(testHelper);

      await commonTestActions.clickAndNavigateToScreen(
        testHelper,
        TEST_IDS.NEW_ARTICLE_BUTTON,
        TEST_IDS.NEW_ARTICLE_SCREEN
      );

      const page2 = testHelper.getPage();
      if (!page2) throw new Error('Page not available');

      await page2.evaluate(() => {
        const titleInput = document.querySelector(
          '[data-testid="article-title-input"] input'
        ) as HTMLInputElement;
        const descriptionInput = document.querySelector(
          '[data-testid="article-description-input"] input'
        ) as HTMLInputElement;
        const bodyInput = document.querySelector(
          '[data-testid="article-body-input"] textarea'
        ) as HTMLTextAreaElement;

        if (titleInput) {
          titleInput.value = 'New Test Article';
          titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          titleInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (descriptionInput) {
          descriptionInput.value = 'This is a new test article description';
          descriptionInput.dispatchEvent(new Event('input', { bubbles: true }));
          descriptionInput.dispatchEvent(
            new Event('change', { bubbles: true })
          );
        }

        if (bodyInput) {
          bodyInput.value =
            'This is the body content of the new test article. It contains detailed information about the topic.';
          bodyInput.dispatchEvent(new Event('input', { bubbles: true }));
          bodyInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      await suite.takeScreenshotAndCompare('new-article-screen-with-form-data');
    });
  }
);
