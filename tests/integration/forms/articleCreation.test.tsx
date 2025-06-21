import { render, fireEvent, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { TEST_IDS } from '../../../src/constants/testIds';
import { NewArticleScreen } from '../../../src/screens/newArticle/newArticleScreen';
import { articlesStore } from '../../../src/store/articlesStore';
import { userStore } from '../../../src/store/userStore';
import { createMockUser, createMockArticle } from '../../mocks/data';

const renderNewArticleScreen = () => {
  return render(<NewArticleScreen />);
};

const fillArticleForm = (getByTestId: any, overrides = {}) => {
  const defaultData = {
    title: 'Test Article Title',
    description: 'Test Article Description',
    body: 'Test Article Body Content',
    ...overrides,
  };

  fireEvent.changeText(
    getByTestId(TEST_IDS.ARTICLE_TITLE_INPUT),
    defaultData.title
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.ARTICLE_DESCRIPTION_INPUT),
    defaultData.description
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.ARTICLE_BODY_INPUT),
    defaultData.body
  );

  return defaultData;
};

describe('Article Creation Integration Tests', () => {
  beforeEach(() => {
    userStore.setUser(createMockUser());
    jest.clearAllMocks();
  });

  describe('Screen Rendering Integration', () => {
    it('renders article creation form when user is authenticated', () => {
      const { getByTestId } = renderNewArticleScreen();

      expect(getByTestId(TEST_IDS.NEW_ARTICLE_SCREEN)).toBeTruthy();
      expect(getByTestId(TEST_IDS.ARTICLE_TITLE_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.ARTICLE_DESCRIPTION_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.ARTICLE_BODY_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON)).toBeTruthy();
    });
  });

  describe('Form Validation Integration', () => {
    it('enables publish button only when all required fields are filled', async () => {
      const { getByTestId } = renderNewArticleScreen();
      const publishButton = getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON);

      expect(publishButton).toBeDisabled();

      fireEvent.changeText(getByTestId(TEST_IDS.ARTICLE_TITLE_INPUT), 'Title');
      expect(publishButton).toBeDisabled();

      fireEvent.changeText(
        getByTestId(TEST_IDS.ARTICLE_DESCRIPTION_INPUT),
        'Description'
      );
      expect(publishButton).toBeDisabled();

      fireEvent.changeText(getByTestId(TEST_IDS.ARTICLE_BODY_INPUT), 'Body');

      await waitFor(() => {
        expect(publishButton).not.toBeDisabled();
      });
    });
  });

  describe('Article Submission Integration', () => {
    it('successfully submits article with store integration', async () => {
      const createArticleSpy = jest
        .spyOn(articlesStore, 'createArticle')
        .mockResolvedValue(createMockArticle());

      const { getByTestId } = renderNewArticleScreen();
      const expectedData = fillArticleForm(getByTestId);

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON)).not.toBeDisabled();
      });

      fireEvent.press(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON));

      expect(createArticleSpy).toHaveBeenCalledWith({
        title: expectedData.title,
        description: expectedData.description,
        body: expectedData.body,
      });
    });

    it('handles article creation failure gracefully', async () => {
      jest
        .spyOn(articlesStore, 'createArticle')
        .mockRejectedValue(new Error('Network error'));

      const { getByTestId } = renderNewArticleScreen();
      fillArticleForm(getByTestId);

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON)).not.toBeDisabled();
      });

      fireEvent.press(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON));

      expect(getByTestId(TEST_IDS.NEW_ARTICLE_SCREEN)).toBeTruthy();
    });
  });

  describe('User Authentication Integration', () => {
    it('requires authenticated user to access form', () => {
      userStore.setUser(createMockUser());
      const { getByTestId } = renderNewArticleScreen();

      expect(getByTestId(TEST_IDS.NEW_ARTICLE_SCREEN)).toBeTruthy();
      expect(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON)).toBeTruthy();
    });
  });

  describe('Form Input Handling Integration', () => {
    it('handles special content correctly through the full form flow', async () => {
      const { getByTestId } = renderNewArticleScreen();
      const specialContent = {
        title: 'Title with "quotes" & symbols',
        description: 'Description with\nnewlines',
        body: 'Body with <HTML> & other special chars: !@#$%',
      };

      fillArticleForm(getByTestId, specialContent);

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON)).not.toBeDisabled();
      });

      const createArticleSpy = jest
        .spyOn(articlesStore, 'createArticle')
        .mockResolvedValue(createMockArticle());

      fireEvent.press(getByTestId(TEST_IDS.PUBLISH_ARTICLE_BUTTON));

      expect(createArticleSpy).toHaveBeenCalledWith(specialContent);
    });
  });
});
