import { render, fireEvent, act, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { TEST_IDS } from '../../../src/constants/testIds';
import { ArticleScreen } from '../../../src/screens/article/articleScreen';
import { articleService, navigationService } from '../../../src/services';
import {
  createMockUser,
  createMockArticle,
  createMockComment,
  createMockAuthor,
} from '../../mocks/data';
import { setMockRoute } from '../../mocks/navigation';
import * as storeMocks from '../../mocks/stores';

const userStore = storeMocks.getUserStore();
const articlesStore = storeMocks.getArticlesStore();

const mockArticle = createMockArticle({
  slug: 'test-article-slug',
  title: 'Test Article Title',
  body: 'This is the test article body content.',
  author: createMockAuthor({ username: 'testauthor' }),
});

const mockComments = [
  createMockComment({
    id: 1,
    body: 'Great article! Thanks for sharing.',
    author: createMockAuthor({ username: 'commenter1' }),
  }),
  createMockComment({
    id: 2,
    body: 'I disagree with some points but overall good read.',
    author: createMockAuthor({ username: 'commenter2' }),
  }),
];

const mockArticleService = articleService as jest.Mocked<typeof articleService>;
const mockNavigationService = navigationService as jest.Mocked<
  typeof navigationService
>;

mockArticleService.getArticle.mockResolvedValue({ article: mockArticle });
mockArticleService.getComments.mockResolvedValue({ comments: mockComments });
mockArticleService.createComment.mockResolvedValue({
  comment: createMockComment({ body: 'New test comment' }),
});
mockArticleService.deleteArticle.mockResolvedValue(undefined);

const mockToggleFavorite = jest.spyOn(
  articlesStore,
  'toggleArticleFavoriteStatus'
);
const mockRemoveArticle = jest.spyOn(articlesStore, 'removeArticle');

const mockArticleRoute = {
  key: 'Article',
  name: 'Article' as const,
  params: { slug: 'test-article-slug' },
};

const renderArticleScreen = () => {
  return render(<ArticleScreen />);
};

const setupAuthenticatedUser = async (userOverrides = {}) => {
  const user = createMockUser(userOverrides);
  await act(async () => {
    userStore.setUser(user);
  });
  return user;
};

describe('Article Screen Tests', () => {
  beforeEach(async () => {
    mockArticleService.getArticle.mockClear();
    mockArticleService.getComments.mockClear();
    mockArticleService.createComment.mockClear();
    mockArticleService.deleteArticle.mockClear();
    mockToggleFavorite.mockClear();
    mockRemoveArticle.mockClear();

    setMockRoute(mockArticleRoute);
    await setupAuthenticatedUser();

    mockArticleService.getArticle.mockResolvedValue({ article: mockArticle });
    mockArticleService.getComments.mockResolvedValue({
      comments: mockComments,
    });
    mockArticleService.createComment.mockResolvedValue({
      comment: createMockComment({ body: 'New test comment' }),
    });
    mockArticleService.deleteArticle.mockResolvedValue(undefined);
    mockToggleFavorite.mockResolvedValue(undefined);
    mockRemoveArticle.mockImplementation(() => undefined);
  });

  describe('Article Display', () => {
    it('displays article content and comments', async () => {
      const { getByText, getByTestId } = renderArticleScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.ARTICLE_SCREEN)).toBeTruthy();
      });

      expect(getByText('Test Article Title')).toBeTruthy();
      expect(getByText('This is the test article body content.')).toBeTruthy();
      expect(getByText('Great article! Thanks for sharing.')).toBeTruthy();
      expect(
        getByText('I disagree with some points but overall good read.')
      ).toBeTruthy();

      expect(mockArticleService.getArticle).toHaveBeenCalledWith(
        'test-article-slug'
      );
      expect(mockArticleService.getComments).toHaveBeenCalledWith(
        'test-article-slug'
      );
    });

    it('displays author information', async () => {
      const { getByText, getByTestId } = renderArticleScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.ARTICLE_SCREEN)).toBeTruthy();
      });

      expect(getByText('testauthor')).toBeTruthy();
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
      fireEvent.changeText(commentInput, 'New test comment');

      const postButton = getByText('Post');
      fireEvent.press(postButton);

      await waitFor(() => {
        expect(mockArticleService.createComment).toHaveBeenCalledWith(
          'test-article-slug',
          {
            body: 'New test comment',
          }
        );
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

      expect(mockArticleService.createComment).not.toHaveBeenCalled();
    });
  });

  describe('Author Actions', () => {
    it('shows edit and delete buttons when user is the author', async () => {
      await act(async () => {
        userStore.setUser(createMockUser({ username: 'testauthor' }));
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
        userStore.setUser(createMockUser({ username: 'testauthor' }));
      });

      const { getByTestId } = renderArticleScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.EDIT_ARTICLE_BUTTON)).toBeTruthy();
      });

      fireEvent.press(getByTestId(TEST_IDS.EDIT_ARTICLE_BUTTON));

      expect(mockNavigationService.navigateToArticleForm).toHaveBeenCalledWith(
        'test-article-slug'
      );
    });

    it('calls delete service when delete button is pressed', async () => {
      await act(async () => {
        userStore.setUser(createMockUser({ username: 'testauthor' }));
      });

      const { getByTestId } = renderArticleScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.DELETE_ARTICLE_BUTTON)).toBeTruthy();
      });

      fireEvent.press(getByTestId(TEST_IDS.DELETE_ARTICLE_BUTTON));

      await waitFor(() => {
        expect(mockArticleService.deleteArticle).toHaveBeenCalledWith(
          'test-article-slug'
        );
        expect(mockRemoveArticle).toHaveBeenCalledWith('test-article-slug');
        expect(mockNavigationService.goBack).toHaveBeenCalled();
      });
    });
  });

  describe('Navigation', () => {
    it('calls navigation service when author name is pressed', async () => {
      const { getByText } = renderArticleScreen();

      await waitFor(() => {
        expect(getByText('testauthor')).toBeTruthy();
      });

      fireEvent.press(getByText('testauthor'));

      expect(
        mockNavigationService.navigateToAuthorProfile
      ).toHaveBeenCalledWith('testauthor');
    });
  });

  describe('Loading States', () => {
    it('shows loading state while fetching article', async () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const unresolvePromise: any = () => new Promise(() => {});
      mockArticleService.getArticle.mockImplementation(unresolvePromise);

      const { queryByTestId } = renderArticleScreen();

      expect(queryByTestId(TEST_IDS.ARTICLE_SCREEN)).toBeNull();
    });

    it('handles service errors gracefully', async () => {
      mockArticleService.getArticle.mockRejectedValue(
        new Error('Network error')
      );
      mockArticleService.getComments.mockRejectedValue(
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
