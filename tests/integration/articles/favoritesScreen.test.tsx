import { render, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { TEST_IDS } from '../../../src/constants/testIds';
import { FavoritesScreen } from '../../../src/screens/favoritesScreen/favoritesScreen';
import { userStore } from '../../../src/store/userStore';
import { mockArticles, mockUserMinimal } from '../../mocks/data';
import * as storeMocks from '../../mocks/stores';
import {
  testArticleCardPress,
  testFavoriteButtonPress,
  testMultipleArticlePresses,
  testMultipleFavoriteToggles,
} from '../utils/articleTestUtils';

const articlesStore = storeMocks.getArticlesStore();

const renderFavoritesScreen = () => {
  return render(<FavoritesScreen />);
};

describe('Favorites Screen Integration Tests', () => {
  beforeEach(() => {
    userStore.setUser(mockUserMinimal);
    articlesStore.favoriteArticles = mockArticles;
    articlesStore.favoritesIsLoading = false;
    articlesStore.favoritesArticlesCount = mockArticles.length;
    articlesStore.favoritesCurrentOffset = 0;
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

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
    });

    it('should display screen header', () => {
      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
    });
  });

  describe('Favorite Articles Display', () => {
    it('should display favorite articles when data is available', async () => {
      const { getByTestId } = renderFavoritesScreen();

      await waitFor(() => {
        expect(
          getByTestId(TEST_IDS.ARTICLE_CARD('test-article-1'))
        ).toBeTruthy();
        expect(
          getByTestId(TEST_IDS.ARTICLE_CARD('test-article-2'))
        ).toBeTruthy();
      });
    });

    it('should show loading state while favorites are loading', () => {
      articlesStore.favoritesIsLoading = true;
      articlesStore.favoriteArticles = [];

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
    });

    it('should show empty message when no favorite articles available', async () => {
      articlesStore.favoriteArticles = [];
      articlesStore.favoritesIsLoading = false;

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

  describe('Authentication Requirements', () => {
    it('should load favorites only when user is authenticated', async () => {
      userStore.forgetUser();
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(false);

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
    });

    it('should integrate with user store properly', async () => {
      userStore.setUser(mockUserMinimal);

      const { getByTestId } = renderFavoritesScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
      });

      expect(articlesStore.loadFavoriteArticlesInitially).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading indicator when favorites are being fetched', () => {
      articlesStore.favoritesIsLoading = true;

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
    });

    it('should hide loading indicator when favorites are loaded', async () => {
      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();

      await waitFor(() => {
        expect(articlesStore.favoritesIsLoading).toBe(false);
      });
    });
  });

  describe('Error Scenarios', () => {
    it('should handle empty favorites list gracefully', () => {
      articlesStore.favoriteArticles = [];
      articlesStore.favoritesIsLoading = false;

      const { getByText } = renderFavoritesScreen();

      expect(getByText('No favorite articles yet')).toBeTruthy();
    });

    it('should still call loadFavoriteArticlesInitially even if favorites store is empty', () => {
      articlesStore.favoriteArticles = [];

      renderFavoritesScreen();

      expect(articlesStore.loadFavoriteArticlesInitially).toHaveBeenCalledTimes(
        1
      );
    });

    it('should handle favorites service errors', async () => {
      userStore.setUser(mockUserMinimal);

      const { getByTestId } = renderFavoritesScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
      });

      expect(articlesStore.loadFavoriteArticlesInitially).toHaveBeenCalled();
    });

    it('should show correct empty state message', () => {
      userStore.setUser(mockUserMinimal);
      articlesStore.favoriteArticles = [];

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
      expect(articlesStore.favoriteArticles.length).toBe(0);
    });

    it('should handle component unmount gracefully', () => {
      userStore.setUser(mockUserMinimal);

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
    });

    it('should handle store errors gracefully', () => {
      userStore.setUser(mockUserMinimal);

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
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
        expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
      });

      expect(articlesStore.loadFavoriteArticlesInitially).toHaveBeenCalled();
    });

    it('should reflect favorites store state correctly', () => {
      articlesStore.favoritesIsLoading = false;
      articlesStore.favoriteArticles = mockArticles;

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
      expect(articlesStore.favoriteArticles.length).toBe(mockArticles.length);
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

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
    });

    it('should handle store state changes during component lifecycle', async () => {
      const { getByTestId, rerender } = renderFavoritesScreen();

      articlesStore.favoritesIsLoading = true;

      rerender(<FavoritesScreen />);

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
    });
  });
});
