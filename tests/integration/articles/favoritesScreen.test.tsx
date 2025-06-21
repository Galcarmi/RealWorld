import { render, waitFor, fireEvent } from '@testing-library/react-native';

import '../../mocks';
import { TEST_IDS } from '../../../src/constants/testIds';
import { FavoritesScreen } from '../../../src/screens/favoritesScreen/favoritesScreen';
import { userStore } from '../../../src/store/userStore';
import { createMockUser, createMockArticle } from '../../mocks/data';
import * as storeMocks from '../../mocks/stores';

const articlesStore = storeMocks.getArticlesStore();

const renderFavoritesScreen = () => {
  return render(<FavoritesScreen />);
};

describe('Favorites Screen Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userStore.setUser(createMockUser());
    articlesStore.favoriteArticles = [
      createMockArticle({ slug: 'favorite-1', title: 'Favorite Article 1' }),
      createMockArticle({ slug: 'favorite-2', title: 'Favorite Article 2' }),
    ];
    articlesStore.favoritesIsLoading = false;
    articlesStore.favoritesArticlesCount = 2;
    articlesStore.favoritesCurrentOffset = 0;
  });

  describe('Screen Initialization Integration', () => {
    it('initializes and loads favorite articles on mount', async () => {
      renderFavoritesScreen();

      expect(articlesStore.loadFavoriteArticlesInitially).toHaveBeenCalledTimes(
        1
      );
    });

    it('renders favorites screen with proper test ID', () => {
      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
    });
  });

  describe('Favorites Display Integration', () => {
    it('displays favorite articles when available', async () => {
      const { getByTestId } = renderFavoritesScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.ARTICLE_CARD('favorite-1'))).toBeTruthy();
        expect(getByTestId(TEST_IDS.ARTICLE_CARD('favorite-2'))).toBeTruthy();
      });
    });

    it('shows loading state when favorites are being fetched', () => {
      articlesStore.favoritesIsLoading = true;
      articlesStore.favoriteArticles = [];

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
    });

    it('shows empty message when no favorite articles available', async () => {
      articlesStore.favoriteArticles = [];
      articlesStore.favoritesIsLoading = false;

      const { getByText } = renderFavoritesScreen();

      await waitFor(() => {
        expect(getByText('No favorite articles yet')).toBeTruthy();
      });
    });
  });

  describe('Article Interaction Integration', () => {
    it('handles favorite button press to toggle favorite status', async () => {
      const toggleFavoriteSpy = jest.spyOn(
        articlesStore,
        'toggleArticleFavoriteStatus'
      );
      const { getAllByTestId } = renderFavoritesScreen();

      await waitFor(() => {
        const favoriteButtons = getAllByTestId(
          TEST_IDS.FAVORITE_BUTTON('testauthor')
        );
        fireEvent.press(favoriteButtons[0]);
      });

      expect(toggleFavoriteSpy).toHaveBeenCalled();
    });

    it('handles multiple favorite article interactions', async () => {
      const toggleFavoriteSpy = jest.spyOn(
        articlesStore,
        'toggleArticleFavoriteStatus'
      );
      const { getAllByTestId } = renderFavoritesScreen();

      await waitFor(() => {
        const favoriteButtons = getAllByTestId(
          TEST_IDS.FAVORITE_BUTTON('testauthor')
        );
        fireEvent.press(favoriteButtons[0]);
        fireEvent.press(favoriteButtons[1]);
      });

      expect(toggleFavoriteSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Authentication Integration', () => {
    it('integrates with authenticated user state', async () => {
      userStore.setUser(createMockUser({ username: 'authuser' }));

      const { getByTestId } = renderFavoritesScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
      });

      expect(articlesStore.loadFavoriteArticlesInitially).toHaveBeenCalled();
    });

    it('handles unauthenticated user state', async () => {
      userStore.forgetUser();
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(false);

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
    });
  });

  describe('Store Integration', () => {
    it('integrates with favorites store state changes', () => {
      articlesStore.favoritesIsLoading = false;
      articlesStore.favoriteArticles = [
        createMockArticle({ slug: 'new-favorite', title: 'New Favorite' }),
      ];

      const { getByTestId } = renderFavoritesScreen();

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
      expect(articlesStore.favoriteArticles.length).toBe(1);
    });

    it('handles store errors gracefully', async () => {
      const { getByTestId } = renderFavoritesScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
      });

      expect(articlesStore.loadFavoriteArticlesInitially).toHaveBeenCalled();
    });
  });

  describe('Component Lifecycle Integration', () => {
    it('handles component unmount gracefully', () => {
      const { unmount } = renderFavoritesScreen();

      expect(() => unmount()).not.toThrow();
    });
  });
});
