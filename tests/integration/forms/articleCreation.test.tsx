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

  describe('Screen Rendering', () => {
    it('renders article creation form with all fields', () => {
      const { getByTestId } = renderNewArticleScreen();

      expect(getByTestId(TEST_IDS.NEW_ARTICLE_SCREEN)).toBeTruthy();
      expect(getByTestId(TEST_IDS.ARTICLE_TITLE_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.ARTICLE_DESCRIPTION_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.ARTICLE_BODY_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON)).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('keeps publish button disabled when form is empty', () => {
      const { getByTestId } = renderNewArticleScreen();

      expect(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON)).toBeDisabled();
    });

    it('enables publish button when all required fields are filled', async () => {
      const { getByTestId } = renderNewArticleScreen();

      fillArticleForm(getByTestId);

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON)).not.toBeDisabled();
      });
    });
  });

  describe('Article Submission', () => {
    it('handles successful article creation', async () => {
      const createArticleSpy = jest.spyOn(articlesStore, 'createArticle');
      const mockArticle = createMockArticle({
        title: 'Test Article Title',
        description: 'Test article description',
      });
      createArticleSpy.mockResolvedValue(mockArticle);

      const { getByTestId } = renderNewArticleScreen();

      fillArticleForm(getByTestId);

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON));
      });

      expect(createArticleSpy).toHaveBeenCalledWith({
        title: 'Test Article Title',
        description: 'Test article description',
        body: 'This is the test article body content.',
      });
    });

    it('handles article creation with minimal data', async () => {
      const createArticleSpy = jest.spyOn(articlesStore, 'createArticle');
      const { getByTestId } = renderNewArticleScreen();

      fillArticleForm(getByTestId, {
        title: 'Minimal Title',
        description: 'Minimal description',
        body: 'Short body',
      });

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON));
      });

      expect(createArticleSpy).toHaveBeenCalledWith({
        title: 'Minimal Title',
        description: 'Minimal description',
        body: 'Short body',
      });
    });

    it('handles article creation errors', async () => {
      const createArticleSpy = jest.spyOn(articlesStore, 'createArticle');
      createArticleSpy.mockRejectedValue(new Error('Creation failed'));

      const { getByTestId } = renderNewArticleScreen();

      fillArticleForm(getByTestId);

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON));
      });

      expect(createArticleSpy).toHaveBeenCalled();
      expect(getByTestId(TEST_IDS.NEW_ARTICLE_SCREEN)).toBeTruthy();
    });
  });

  describe('User Authentication', () => {
    it('works with authenticated user context', () => {
      const { getByTestId } = renderNewArticleScreen();

      expect(getByTestId(TEST_IDS.NEW_ARTICLE_SCREEN)).toBeTruthy();
      expect(userStore.isAuthenticated()).toBe(true);
    });
  });

  describe('Form Input Handling', () => {
    it('handles form input changes correctly', async () => {
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId(TEST_IDS.ARTICLE_TITLE_INPUT);
      const bodyInput = getByTestId(TEST_IDS.ARTICLE_BODY_INPUT);

      fireEvent.changeText(titleInput, 'Updated Title');
      fireEvent.changeText(bodyInput, 'Updated body content');

      await waitFor(() => {
        expect(titleInput.props.value).toBe('Updated Title');
        expect(bodyInput.props.value).toBe('Updated body content');
      });
    });

    it('handles form data correctly', async () => {
      const createArticleSpy = jest.spyOn(articlesStore, 'createArticle');
      const { getByTestId } = renderNewArticleScreen();

      fillArticleForm(getByTestId, {
        title: 'Custom Title',
        description: 'Custom description',
        body: 'Custom body content',
      });

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON));
      });

      expect(createArticleSpy).toHaveBeenCalledWith({
        title: 'Custom Title',
        description: 'Custom description',
        body: 'Custom body content',
      });
    });
  });
});
