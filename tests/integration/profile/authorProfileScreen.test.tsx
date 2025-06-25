import { render, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { TEST_IDS } from '../../../src/constants/testIds';
import { AuthorProfileScreen } from '../../../src/screens/authorProfile/authorProfileScreen';
import {
  createMockUser,
  createMockArticle,
  createMockAuthor,
} from '../../mocks/data';
import { setMockRoute, mockAuthorProfileRoute } from '../../mocks/navigation';
import * as mockServices from '../../mocks/services';
import * as storeMocks from '../../mocks/stores';

const userStore = storeMocks.getUserStore();
const articlesStore = storeMocks.getArticlesStore();

const renderAuthorProfileScreen = () => {
  return render(<AuthorProfileScreen />);
};

describe('Author Profile Screen Tests', () => {
  const mockAuthor = createMockAuthor({
    username: 'testauthor',
    bio: 'Author bio description',
    image: 'https://example.com/avatar.jpg',
    following: false,
  });

  const mockArticles = [
    createMockArticle({
      slug: 'test-article-1',
      title: 'First Article',
      author: mockAuthor,
      favorited: false,
    }),
    createMockArticle({
      slug: 'test-article-2',
      title: 'Second Article',
      author: mockAuthor,
      favorited: true,
    }),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    setMockRoute(mockAuthorProfileRoute);
    userStore.setUser(createMockUser());

    mockServices.setupServiceMocks();

    articlesStore.getUserArticles = jest.fn().mockResolvedValue({
      articles: mockArticles,
      articlesCount: mockArticles.length,
    });
    articlesStore.toggleArticleFavoriteStatus = jest
      .fn()
      .mockResolvedValue(undefined);
  });

  describe('Profile Display', () => {
    it('displays author profile information and articles', async () => {
      const { getByTestId, getByText } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.AUTHOR_PROFILE_SCREEN)).toBeTruthy();
      });

      await waitFor(() => {
        expect(getByText('First Article')).toBeTruthy();
        expect(getByText('Second Article')).toBeTruthy();
      });

      expect(articlesStore.getUserArticles).toHaveBeenCalledWith(
        'testauthor',
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('shows empty state when author has no articles', async () => {
      articlesStore.getUserArticles = jest.fn().mockResolvedValue({
        articles: [],
        articlesCount: 0,
      });

      const { getByText } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByText('No articles found')).toBeTruthy();
      });
    });
  });

  describe('Follow/Unfollow Functionality', () => {
    it('shows follow button for unfollowed authors', async () => {
      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.AUTHOR_PROFILE_SCREEN)).toBeTruthy();
      });

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.FOLLOW_BUTTON)).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles articles loading errors gracefully', async () => {
      articlesStore.getUserArticles = jest
        .fn()
        .mockRejectedValue(new Error('Network error'));

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.AUTHOR_PROFILE_SCREEN)).toBeTruthy();
      });

      expect(articlesStore.getUserArticles).toHaveBeenCalledWith(
        'testauthor',
        expect.any(Number),
        expect.any(Number)
      );
    });
  });
});
