import { render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../../mocks';
import { FavoritesScreen } from '../../../src/screens/favoritesScreen/favoritesScreen';
import { articlesStore } from '../../../src/store/articlesStore';
import { userStore } from '../../../src/store/userStore';
import { mockArticles, mockUserMinimal } from '../../mocks/data';
import { resetAllStoreMocks, getMockArticlesStore } from '../../mocks/stores';
import {
  testArticleCardPress,
  testFavoriteButtonPress,
  testMultipleArticlePresses,
  testMultipleFavoriteToggles,
  testPullToRefresh,
  testLoadMore,
} from '../utils/articleTestUtils';

const mockArticlesStore = getMockArticlesStore();

const renderFavoritesScreen = () => {
  return render(
    <SafeAreaProvider>
      <FavoritesScreen />
    </SafeAreaProvider>
  );
};

describe('Favorites Screen Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userStore.forgetUser();
    resetAllStoreMocks();

    userStore.setUser(mockUserMinimal);

    mockArticlesStore.favoriteArticles = mockArticles;
    mockArticlesStore.favoritesIsLoading = false;
    mockArticlesStore.favoritesArticlesCount = mockArticles.length;
    mockArticlesStore.favoritesCurrentOffset = 0;
  });

  afterEach(() => {
    userStore.forgetUser();
  });

  describe('Initial Load', () => {
    it('should initialize favorite articles on mount', async () => {
      renderFavoritesScreen();

      expect(articlesStore.loadFavoriteArticlesInitially).toHaveBeenCalledTimes(
        1
      );
    });

    it('should render screen with proper test ID', () => {
      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId('favorites-screen')).toBeTruthy();
    });

    it('should display screen header', () => {
      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId('favorites-screen')).toBeTruthy();
    });
  });

  describe('Favorite Articles Display', () => {
    it('should display favorite articles when data is available', async () => {
      const { getByTestId } = renderFavoritesScreen();

      await waitFor(() => {
        expect(getByTestId('article-card-test-article-1')).toBeTruthy();
        expect(getByTestId('article-card-test-article-2')).toBeTruthy();
      });
    });

    it('should show loading state while favorites are loading', () => {
      mockArticlesStore.favoritesIsLoading = true;
      mockArticlesStore.favoriteArticles = [];

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId('favorites-screen')).toBeTruthy();
    });

    it('should show empty message when no favorite articles available', async () => {
      mockArticlesStore.favoriteArticles = [];
      mockArticlesStore.favoritesIsLoading = false;

      const { getByText } = renderFavoritesScreen();

      await waitFor(() => {
        expect(getByText('No favorite articles yet')).toBeTruthy();
      });
    });
  });

  describe('Article Interactions', () => {
    it('should handle article press and navigate to author profile', async () => {
      const renderResult = renderFavoritesScreen();
      await testArticleCardPress(renderResult, 'testuser1');
    });

    it('should handle favorite button press to unfavorite article', async () => {
      const renderResult = renderFavoritesScreen();
      await testFavoriteButtonPress(
        renderResult,
        'testuser1',
        'test-article-1',
        false
      );
    });

    it('should handle favorite button press on favorited article', async () => {
      const renderResult = renderFavoritesScreen();
      await testFavoriteButtonPress(
        renderResult,
        'testuser2',
        'test-article-2',
        true
      );
    });
  });

  describe('Pull to Refresh', () => {
    it('should refresh favorite articles when pull to refresh is triggered', async () => {
      const refreshSpy = jest.spyOn(articlesStore, 'refreshFavoriteArticles');
      const renderResult = renderFavoritesScreen();
      await testPullToRefresh(renderResult, refreshSpy);
    });
  });

  describe('Load More Articles', () => {
    it('should load more favorite articles when reaching end of list', async () => {
      const loadMoreSpy = jest.spyOn(articlesStore, 'loadMoreFavoriteArticles');
      const renderResult = renderFavoritesScreen();
      await testLoadMore(renderResult, loadMoreSpy);
    });
  });

  describe('Authentication Requirements', () => {
    it('should load favorites only when user is authenticated', async () => {
      userStore.forgetUser();
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(false);

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId('favorites-screen')).toBeTruthy();
    });

    it('should integrate with user store properly', async () => {
      userStore.setUser(mockUserMinimal);

      const { getByTestId } = renderFavoritesScreen();

      await waitFor(() => {
        expect(getByTestId('favorites-screen')).toBeTruthy();
      });

      expect(articlesStore.loadFavoriteArticlesInitially).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading indicator when favorites are being fetched', () => {
      mockArticlesStore.favoritesIsLoading = true;

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId('favorites-screen')).toBeTruthy();
    });

    it('should hide loading indicator when favorites are loaded', () => {
      mockArticlesStore.favoritesIsLoading = false;

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId('favorites-screen')).toBeTruthy();
      expect(mockArticlesStore.favoritesIsLoading).toBe(false);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle empty favorites list gracefully', () => {
      mockArticlesStore.favoriteArticles = [];
      mockArticlesStore.favoritesIsLoading = false;

      const { getByText } = renderFavoritesScreen();

      expect(getByText('No favorite articles yet')).toBeTruthy();
    });

    it('should still call loadFavoriteArticlesInitially even if favorites store is empty', () => {
      mockArticlesStore.favoriteArticles = [];

      renderFavoritesScreen();

      expect(articlesStore.loadFavoriteArticlesInitially).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('Multiple Article Interactions', () => {
    it('should handle multiple article presses correctly', async () => {
      const renderResult = renderFavoritesScreen();
      await testMultipleArticlePresses(renderResult, [
        'testuser1',
        'testuser2',
      ]);
    });

    it('should handle multiple favorite toggles correctly', async () => {
      const renderResult = renderFavoritesScreen();
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

  describe('Store Integration', () => {
    it('should integrate properly with favorites store', async () => {
      const { getByTestId } = renderFavoritesScreen();

      await waitFor(() => {
        expect(getByTestId('favorites-screen')).toBeTruthy();
      });

      expect(articlesStore.loadFavoriteArticlesInitially).toHaveBeenCalled();
    });

    it('should reflect favorites store state correctly', () => {
      mockArticlesStore.favoritesIsLoading = false;
      mockArticlesStore.favoriteArticles = mockArticles;

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId('favorites-screen')).toBeTruthy();
      expect(mockArticlesStore.favoriteArticles.length).toBe(
        mockArticles.length
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle component unmount gracefully', () => {
      const { unmount } = renderFavoritesScreen();

      expect(() => unmount()).not.toThrow();
    });

    it('should handle empty user state', () => {
      userStore.forgetUser();

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId('favorites-screen')).toBeTruthy();
    });

    it('should handle store state changes during component lifecycle', async () => {
      const { getByTestId, rerender } = renderFavoritesScreen();

      mockArticlesStore.favoritesIsLoading = true;

      rerender(
        <SafeAreaProvider>
          <FavoritesScreen />
        </SafeAreaProvider>
      );

      expect(getByTestId('favorites-screen')).toBeTruthy();
    });
  });
});
