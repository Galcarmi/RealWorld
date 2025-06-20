import { render, fireEvent, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { FeedType } from '../../../src/constants/feedTypes';
import { TEST_IDS } from '../../../src/constants/testIds';
import { HomeScreen } from '../../../src/screens/homeScreen/homeScreen';
import { articlesStore } from '../../../src/store/articlesStore';
import { userStore } from '../../../src/store/userStore';
import { mockArticles, mockUserMinimal } from '../../mocks/data';
import { resetAllStoreMocks, getMockArticlesStore } from '../../mocks/stores';
import {
  testArticleCardPress,
  testFavoriteButtonPress,
  testMultipleArticlePresses,
  testMultipleFavoriteToggles,
} from '../utils/articleTestUtils';

const mockArticlesStore = getMockArticlesStore();

const renderHomeScreen = () => {
  return render(<HomeScreen />);
};

describe('Home Screen Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userStore.forgetUser();
    resetAllStoreMocks();

    mockArticlesStore.homeArticles = mockArticles;
    mockArticlesStore.homeIsLoading = false;
    mockArticlesStore.feedType = FeedType.GLOBAL;
    mockArticlesStore.homeArticlesCount = mockArticles.length;
  });

  afterEach(() => {
    userStore.forgetUser();
  });

  describe('Initial Load', () => {
    it('should initialize articles on mount', async () => {
      renderHomeScreen();

      expect(articlesStore.loadHomeArticlesInitially).toHaveBeenCalledTimes(1);
    });

    it('should render screen with proper test ID', () => {
      const { getByTestId } = renderHomeScreen();

      expect(getByTestId(TEST_IDS.HOME_SCREEN)).toBeTruthy();
    });
  });

  describe('Article List Display', () => {
    it('should display articles when data is available', async () => {
      const { getByTestId } = renderHomeScreen();

      await waitFor(() => {
        expect(
          getByTestId(TEST_IDS.ARTICLE_CARD(mockArticles[0].slug))
        ).toBeTruthy();
        expect(
          getByTestId(TEST_IDS.ARTICLE_CARD(mockArticles[1].slug))
        ).toBeTruthy();
      });
    });

    it('should show loading state while articles are loading', () => {
      mockArticlesStore.homeIsLoading = true;
      mockArticlesStore.homeArticles = [];

      const { getByTestId } = renderHomeScreen();

      expect(getByTestId(TEST_IDS.HOME_SCREEN)).toBeTruthy();
    });

    it('should show empty message when no articles available in global feed', async () => {
      mockArticlesStore.homeArticles = [];
      mockArticlesStore.homeIsLoading = false;
      mockArticlesStore.feedType = FeedType.GLOBAL;

      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        expect(getByText('No articles available')).toBeTruthy();
      });
    });

    it('should show different empty message for user feed', async () => {
      mockArticlesStore.homeArticles = [];
      mockArticlesStore.homeIsLoading = false;
      mockArticlesStore.feedType = FeedType.FEED;

      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        expect(
          getByText('Follow some users to see their articles here')
        ).toBeTruthy();
      });
    });
  });

  describe('Feed Tabs - Unauthenticated User', () => {
    beforeEach(() => {
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(false);
    });

    it('should not show feed tabs when user is not authenticated', () => {
      const { queryByText } = renderHomeScreen();

      expect(queryByText('For You')).toBeNull();
      expect(queryByText('Following')).toBeNull();
    });
  });

  describe('Feed Tabs - Authenticated User', () => {
    beforeEach(() => {
      userStore.setUser(mockUserMinimal);
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(true);
    });

    it('should show feed tabs when user is authenticated', async () => {
      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        expect(getByText('For You')).toBeTruthy();
        expect(getByText('Following')).toBeTruthy();
      });
    });

    it('should switch to global feed when "For You" tab is pressed', async () => {
      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        const forYouTab = getByText('For You');
        fireEvent.press(forYouTab);
      });

      expect(articlesStore.switchToGlobalFeed).toHaveBeenCalledTimes(1);
    });

    it('should switch to user feed when "Following" tab is pressed', async () => {
      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        const followingTab = getByText('Following');
        fireEvent.press(followingTab);
      });

      expect(articlesStore.switchToUserFeed).toHaveBeenCalledTimes(1);
    });
  });

  describe('Article Interactions', () => {
    it('should handle article press and navigate to author profile', async () => {
      const renderResult = renderHomeScreen();
      await testArticleCardPress(renderResult, 'testuser1');
    });

    it('should handle favorite button press on unfavorited article', async () => {
      const renderResult = renderHomeScreen();
      await testFavoriteButtonPress(
        renderResult,
        'testuser1',
        'test-article-1',
        false
      );
    });

    it('should handle favorite button press on favorited article', async () => {
      const renderResult = renderHomeScreen();
      await testFavoriteButtonPress(
        renderResult,
        'testuser2',
        'test-article-2',
        true
      );
    });
  });

  describe('Feed Type Specific Scenarios', () => {
    beforeEach(() => {
      userStore.setUser(mockUserMinimal);
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(true);
    });

    it('should maintain global feed state correctly', async () => {
      mockArticlesStore.feedType = FeedType.GLOBAL;

      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        const forYouTab = getByText('For You');

        expect(forYouTab).toBeTruthy();
      });
    });

    it('should maintain user feed state correctly', async () => {
      mockArticlesStore.feedType = FeedType.FEED;

      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        const followingTab = getByText('Following');

        expect(followingTab).toBeTruthy();
      });
    });

    it('should display appropriate empty messages for different feed types', async () => {
      mockArticlesStore.homeArticles = [];
      mockArticlesStore.feedType = FeedType.GLOBAL;

      const { getByText: getByTextGlobal } = renderHomeScreen();
      expect(getByTextGlobal('No articles available')).toBeTruthy();
    });
  });

  describe('Multiple Article Interactions', () => {
    it('should handle multiple article presses correctly', async () => {
      const renderResult = renderHomeScreen();
      await testMultipleArticlePresses(renderResult, [
        'testuser1',
        'testuser2',
      ]);
    });

    it('should handle multiple favorite toggles correctly', async () => {
      const renderResult = renderHomeScreen();
      await testMultipleFavoriteToggles(renderResult, [
        {
          username: 'testuser1',
          articleSlug: 'test-article-1',
          currentFavoritedStatus: false,
        },
        {
          username: 'testuser2',
          articleSlug: 'test-article-2',
          currentFavoritedStatus: true,
        },
      ]);
    });
  });

  describe('Feed Switching Integration', () => {
    beforeEach(() => {
      userStore.setUser(mockUserMinimal);
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(true);
    });

    it('should handle rapid feed switching', async () => {
      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        fireEvent.press(getByText('Following'));
      });

      await waitFor(() => {
        fireEvent.press(getByText('For You'));
      });

      expect(articlesStore.switchToUserFeed).toHaveBeenCalledTimes(1);
      expect(articlesStore.switchToGlobalFeed).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle empty articles list gracefully', () => {
      mockArticlesStore.homeArticles = [];
      mockArticlesStore.homeIsLoading = false;

      const { getByText } = renderHomeScreen();

      expect(getByText('No articles available')).toBeTruthy();
    });

    it('should still call loadHomeArticlesInitially even if articles store is empty', () => {
      mockArticlesStore.homeArticles = [];

      renderHomeScreen();

      expect(articlesStore.loadHomeArticlesInitially).toHaveBeenCalledTimes(1);
    });
  });
});
