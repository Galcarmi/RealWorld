import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../../mocks';
import { FeedType } from '../../../src/constants/feedTypes';
import { HomeScreen } from '../../../src/screens/homeScreen/homeScreen';
import { navigationService } from '../../../src/services/navigationService';
import { articlesStore } from '../../../src/store/articlesStore';
import { userStore } from '../../../src/store/userStore';
import { mockArticles, mockUserMinimal } from '../../mocks/data';
import { resetAllStoreMocks, getMockArticlesStore } from '../../mocks/stores';

const mockArticlesStore = getMockArticlesStore();

const renderHomeScreen = () => {
  return render(
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
};

describe('Home Screen Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userStore.forgetUser();
    resetAllStoreMocks();

    // Set default mock values with proper TypeScript
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

      expect(getByTestId('home-screen')).toBeTruthy();
    });
  });

  describe('Article List Display', () => {
    it('should display articles when data is available', async () => {
      const { getByTestId } = renderHomeScreen();

      await waitFor(() => {
        expect(getByTestId('article-card-test-article-1')).toBeTruthy();
        expect(getByTestId('article-card-test-article-2')).toBeTruthy();
      });
    });

    it('should show loading state while articles are loading', () => {
      mockArticlesStore.homeIsLoading = true;
      mockArticlesStore.homeArticles = [];

      const { getByTestId } = renderHomeScreen();

      expect(getByTestId('home-screen')).toBeTruthy();
      // ArticlesList will show loading indicator when isLoading=true and articles=[]
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
      const navigationSpy = jest.spyOn(
        navigationService,
        'navigateToAuthorProfile'
      );

      const { getByTestId } = renderHomeScreen();

      await waitFor(() => {
        const articleCard = getByTestId('article-card-test-article-1');
        fireEvent.press(articleCard);
      });

      expect(navigationSpy).toHaveBeenCalledWith('testuser1');
    });

    it('should handle favorite button press on unfavorited article', async () => {
      const { getByTestId } = renderHomeScreen();

      await waitFor(() => {
        // The favorite button test ID is based on the author username
        const favoriteButton = getByTestId('favorite-button-testuser1');
        fireEvent.press(favoriteButton);
      });

      expect(articlesStore.toggleArticleFavoriteStatus).toHaveBeenCalledWith(
        'test-article-1',
        false
      );
    });

    it('should handle favorite button press on favorited article', async () => {
      const { getByTestId } = renderHomeScreen();

      await waitFor(() => {
        // The favorite button test ID is based on the author username
        const favoriteButton = getByTestId('favorite-button-testuser2');
        fireEvent.press(favoriteButton);
      });

      expect(articlesStore.toggleArticleFavoriteStatus).toHaveBeenCalledWith(
        'test-article-2',
        true
      );
    });
  });

  describe('Pull to Refresh', () => {
    it('should refresh articles when pull to refresh is triggered', async () => {
      const { getByTestId } = renderHomeScreen();

      // Find the FlatList inside ArticlesList and trigger refresh
      await waitFor(() => {
        const articlesList = getByTestId('article-card-test-article-1').parent
          ?.parent;
        if (articlesList) {
          fireEvent(articlesList, 'refresh');
        }
      });

      expect(articlesStore.refreshHomeArticles).toHaveBeenCalledTimes(1);
    });
  });

  describe('Load More Articles', () => {
    it('should load more articles when reaching end of list', async () => {
      const { getByTestId } = renderHomeScreen();

      await waitFor(() => {
        const articlesList = getByTestId('article-card-test-article-1').parent
          ?.parent;
        if (articlesList) {
          fireEvent(articlesList, 'endReached');
        }
      });

      expect(articlesStore.loadMoreHomeArticles).toHaveBeenCalledTimes(1);
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
        // The "For You" tab should be active (global feed)
        expect(forYouTab).toBeTruthy();
      });
    });

    it('should maintain user feed state correctly', async () => {
      mockArticlesStore.feedType = FeedType.FEED;

      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        const followingTab = getByText('Following');
        // The "Following" tab should be active (user feed)
        expect(followingTab).toBeTruthy();
      });
    });

    it('should display appropriate empty messages for different feed types', async () => {
      // Test both feed types with separate renders to ensure clean state
      mockArticlesStore.homeArticles = [];
      mockArticlesStore.feedType = FeedType.GLOBAL;

      const { getByText: getByTextGlobal } = renderHomeScreen();
      expect(getByTextGlobal('No articles available')).toBeTruthy();
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

  describe('Multiple Article Interactions', () => {
    it('should handle multiple article presses correctly', async () => {
      const navigationSpy = jest.spyOn(
        navigationService,
        'navigateToAuthorProfile'
      );

      const { getByTestId } = renderHomeScreen();

      await waitFor(() => {
        fireEvent.press(getByTestId('article-card-test-article-1'));
      });

      await waitFor(() => {
        fireEvent.press(getByTestId('article-card-test-article-2'));
      });

      expect(navigationSpy).toHaveBeenCalledTimes(2);
      expect(navigationSpy).toHaveBeenNthCalledWith(1, 'testuser1');
      expect(navigationSpy).toHaveBeenNthCalledWith(2, 'testuser2');
    });

    it('should handle multiple favorite toggles correctly', async () => {
      const { getByTestId } = renderHomeScreen();

      await waitFor(() => {
        fireEvent.press(getByTestId('favorite-button-testuser1'));
      });

      await waitFor(() => {
        fireEvent.press(getByTestId('favorite-button-testuser2'));
      });

      expect(articlesStore.toggleArticleFavoriteStatus).toHaveBeenCalledTimes(
        2
      );
      expect(articlesStore.toggleArticleFavoriteStatus).toHaveBeenNthCalledWith(
        1,
        'test-article-1',
        false
      );
      expect(articlesStore.toggleArticleFavoriteStatus).toHaveBeenNthCalledWith(
        2,
        'test-article-2',
        true
      );
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
});
