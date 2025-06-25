import { fireEvent, act, waitFor } from '@testing-library/react-native';

import '../../mocks';
import {
  renderArticleScreen,
  setupArticleScreenTest,
} from '../../utils/testHelpers';

import { TEST_IDS } from '../../../src/constants/testIds';
import { articleScreenTestMocks, createMockUser } from '../../mocks/data';
import { setupArticleScreenMocks } from '../../mocks/services';
import * as storeMocks from '../../mocks/stores';

const userStore = storeMocks.getUserStore();
const articlesStore = storeMocks.getArticlesStore();
const mockRemoveArticle = jest.spyOn(articlesStore, 'removeArticle');

describe('Article Screen Tests', () => {
  let mockServices: ReturnType<typeof setupArticleScreenMocks>;

  beforeEach(async () => {
    mockRemoveArticle.mockClear();

    mockServices = setupArticleScreenMocks();

    await setupArticleScreenTest();

    mockRemoveArticle.mockImplementation(() => undefined);
  });

  describe('Article Display', () => {
    it('displays article content and comments', async () => {
      const { getByText, getByTestId } = renderArticleScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.ARTICLE_SCREEN)).toBeTruthy();
      });

      expect(getByText(articleScreenTestMocks.article.title)).toBeTruthy();
      expect(getByText(articleScreenTestMocks.article.body)).toBeTruthy();
      expect(getByText(articleScreenTestMocks.comments[0].body)).toBeTruthy();
      expect(getByText(articleScreenTestMocks.comments[1].body)).toBeTruthy();

      expect(mockServices.mockArticleService.getArticle).toHaveBeenCalledWith(
        articleScreenTestMocks.route.params.slug
      );
      expect(mockServices.mockArticleService.getComments).toHaveBeenCalledWith(
        articleScreenTestMocks.route.params.slug
      );
    });

    it('displays author information', async () => {
      const { getByText, getByTestId } = renderArticleScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.ARTICLE_SCREEN)).toBeTruthy();
      });

      expect(
        getByText(articleScreenTestMocks.article.author.username)
      ).toBeTruthy();
    });
  });

  describe('Comment Functionality', () => {
    it('allows user to type in comment input', async () => {
      const { getByPlaceholderText, getByTestId } = renderArticleScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.ARTICLE_SCREEN)).toBeTruthy();
      });

      const commentInput = getByPlaceholderText('Add a comment...');
      fireEvent.changeText(commentInput, 'This is my test comment');

      expect(commentInput.props.value).toBe('This is my test comment');
    });

    it('creates new comment when post button is pressed', async () => {
      const { getByPlaceholderText, getByText, getByTestId } =
        renderArticleScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.ARTICLE_SCREEN)).toBeTruthy();
      });

      const commentInput = getByPlaceholderText('Add a comment...');
      fireEvent.changeText(
        commentInput,
        articleScreenTestMocks.newComment.body
      );

      const postButton = getByText('Post');
      fireEvent.press(postButton);

      await waitFor(() => {
        expect(
          mockServices.mockArticleService.createComment
        ).toHaveBeenCalledWith(articleScreenTestMocks.route.params.slug, {
          body: articleScreenTestMocks.newComment.body,
        });
      });
    });

    it('prevents posting empty comments', async () => {
      const { getByPlaceholderText, getByText, getByTestId } =
        renderArticleScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.ARTICLE_SCREEN)).toBeTruthy();
      });

      const commentInput = getByPlaceholderText('Add a comment...');
      fireEvent.changeText(commentInput, '   ');

      const postButton = getByText('Post');
      fireEvent.press(postButton);

      expect(
        mockServices.mockArticleService.createComment
      ).not.toHaveBeenCalled();
    });
  });

  describe('Author Actions', () => {
    it('shows edit and delete buttons when user is the author', async () => {
      await act(async () => {
        userStore.setUser(
          createMockUser({
            username: articleScreenTestMocks.article.author.username,
          })
        );
      });

      const { getByTestId } = renderArticleScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.ARTICLE_SCREEN)).toBeTruthy();
      });

      expect(getByTestId(TEST_IDS.EDIT_ARTICLE_BUTTON)).toBeTruthy();
      expect(getByTestId(TEST_IDS.DELETE_ARTICLE_BUTTON)).toBeTruthy();
    });

    it('hides edit and delete buttons when user is not the author', async () => {
      await act(async () => {
        userStore.setUser(createMockUser({ username: 'differentuser' }));
      });

      const { queryByTestId, getByTestId } = renderArticleScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.ARTICLE_SCREEN)).toBeTruthy();
      });

      expect(queryByTestId(TEST_IDS.EDIT_ARTICLE_BUTTON)).toBeNull();
      expect(queryByTestId(TEST_IDS.DELETE_ARTICLE_BUTTON)).toBeNull();
    });

    it('calls navigation service when edit button is pressed', async () => {
      await act(async () => {
        userStore.setUser(
          createMockUser({
            username: articleScreenTestMocks.article.author.username,
          })
        );
      });

      const { getByTestId } = renderArticleScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.EDIT_ARTICLE_BUTTON)).toBeTruthy();
      });

      fireEvent.press(getByTestId(TEST_IDS.EDIT_ARTICLE_BUTTON));

      expect(
        mockServices.mockNavigationService.navigateToArticleForm
      ).toHaveBeenCalledWith(articleScreenTestMocks.route.params.slug);
    });

    it('calls delete service when delete button is pressed', async () => {
      await act(async () => {
        userStore.setUser(
          createMockUser({
            username: articleScreenTestMocks.article.author.username,
          })
        );
      });

      const { getByTestId } = renderArticleScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.DELETE_ARTICLE_BUTTON)).toBeTruthy();
      });

      fireEvent.press(getByTestId(TEST_IDS.DELETE_ARTICLE_BUTTON));

      await waitFor(() => {
        expect(
          mockServices.mockArticleService.deleteArticle
        ).toHaveBeenCalledWith(articleScreenTestMocks.route.params.slug);
        expect(mockRemoveArticle).toHaveBeenCalledWith(
          articleScreenTestMocks.route.params.slug
        );
        expect(mockServices.mockNavigationService.goBack).toHaveBeenCalled();
      });
    });
  });

  describe('Navigation', () => {
    it('calls navigation service when author name is pressed', async () => {
      const { getByText } = renderArticleScreen();

      await waitFor(() => {
        expect(
          getByText(articleScreenTestMocks.article.author.username)
        ).toBeTruthy();
      });

      fireEvent.press(
        getByText(articleScreenTestMocks.article.author.username)
      );

      expect(
        mockServices.mockNavigationService.navigateToAuthorProfile
      ).toHaveBeenCalledWith(articleScreenTestMocks.article.author.username);
    });
  });

  describe('Loading States', () => {
    it('shows loading state while fetching article', async () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const unresolvePromise: any = () => new Promise(() => {});
      mockServices.mockArticleService.getArticle.mockImplementation(
        unresolvePromise
      );

      const { queryByTestId } = renderArticleScreen();

      expect(queryByTestId(TEST_IDS.ARTICLE_SCREEN)).toBeNull();
    });

    it('handles service errors gracefully', async () => {
      mockServices.mockArticleService.getArticle.mockRejectedValue(
        new Error('Network error')
      );
      mockServices.mockArticleService.getComments.mockRejectedValue(
        new Error('Network error')
      );

      const { queryByTestId } = renderArticleScreen();

      await waitFor(
        () => {
          expect(queryByTestId(TEST_IDS.ARTICLE_SCREEN)).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });
  });
});
