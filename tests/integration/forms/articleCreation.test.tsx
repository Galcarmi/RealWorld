import { render, fireEvent, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { fillArticleForm } from '../../utils/formHelpers';

import { TEST_IDS } from '../../../src/constants/testIds';
import { NewArticleScreen } from '../../../src/screens/newArticle/newArticleScreen';
import { createMockUser, createMockArticle } from '../../mocks/data';
import * as storeMocks from '../../mocks/stores';

const articlesStore = storeMocks.getArticlesStore();
const userStore = storeMocks.getUserStore();

const renderNewArticleScreen = () => {
  return render(<NewArticleScreen />);
};

describe('Article Creation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userStore.setUser(createMockUser());
  });

  describe('Article Publishing', () => {
    it('renders form and enables publishing when form is valid', async () => {
      const { getByTestId } = renderNewArticleScreen();

      expect(getByTestId(TEST_IDS.NEW_ARTICLE_SCREEN)).toBeTruthy();
      expect(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON)).toBeTruthy();

      expect(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON)).toBeDisabled();

      fillArticleForm(getByTestId);

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON)).not.toBeDisabled();
      });
    });

    it('successfully creates article with provided data', async () => {
      const createArticleSpy = jest.spyOn(articlesStore, 'createArticle');
      const mockArticle = createMockArticle({
        title: 'Test Article Title',
        description: 'Test article description',
      });
      createArticleSpy.mockResolvedValue(mockArticle);

      const { getByTestId } = renderNewArticleScreen();

      fillArticleForm(getByTestId);

      fireEvent.press(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON));

      await waitFor(() => {
        expect(createArticleSpy).toHaveBeenCalledWith({
          title: 'Test Article Title',
          description: 'Test article description',
          body: 'This is the test article body content.',
        });
      });
    });

    it('creates article with custom content', async () => {
      const createArticleSpy = jest.spyOn(articlesStore, 'createArticle');
      const mockArticle = createMockArticle();
      createArticleSpy.mockResolvedValue(mockArticle);

      const { getByTestId } = renderNewArticleScreen();

      fillArticleForm(getByTestId, {
        title: 'Custom Article Title',
        description: 'Custom description text',
        body: 'Custom article body content with details.',
      });

      fireEvent.press(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON));

      await waitFor(() => {
        expect(createArticleSpy).toHaveBeenCalledWith({
          title: 'Custom Article Title',
          description: 'Custom description text',
          body: 'Custom article body content with details.',
        });
      });
    });

    it('handles article creation failure gracefully', async () => {
      const createArticleSpy = jest.spyOn(articlesStore, 'createArticle');
      createArticleSpy.mockRejectedValue(new Error('Creation failed'));

      const { getByTestId } = renderNewArticleScreen();

      fillArticleForm(getByTestId);

      fireEvent.press(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON));

      await waitFor(() => {
        expect(createArticleSpy).toHaveBeenCalled();
        expect(getByTestId(TEST_IDS.NEW_ARTICLE_SCREEN)).toBeTruthy();
      });
    });
  });

  describe('User Context', () => {
    it('works with authenticated user', () => {
      const { getByTestId } = renderNewArticleScreen();

      expect(getByTestId(TEST_IDS.NEW_ARTICLE_SCREEN)).toBeTruthy();
      expect(userStore.isAuthenticated()).toBe(true);
    });
  });
});
