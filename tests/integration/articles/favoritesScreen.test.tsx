import { render, waitFor, fireEvent } from '@testing-library/react-native';

import '../../mocks';
import { TEST_IDS } from '../../../src/constants/testIds';
import { FavoritesScreen } from '../../../src/screens/favoritesScreen/favoritesScreen';
import { createMockUser, createMockArticle } from '../../mocks/data';
import * as storeMocks from '../../mocks/stores';

const articlesStore = storeMocks.getArticlesStore();
const userStore = storeMocks.getUserStore();

const renderFavoritesScreen = () => {
  return render(<FavoritesScreen />);
};

describe('Favorites Screen Tests', () => {
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

  describe('Favorites Management', () => {
    it('initializes and displays favorite articles', async () => {
      const { getByTestId } = renderFavoritesScreen();

      expect(articlesStore.loadFavoriteArticlesInitially).toHaveBeenCalledTimes(
        1
      );
      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.ARTICLE_CARD('favorite-1'))).toBeTruthy();
        expect(getByTestId(TEST_IDS.ARTICLE_CARD('favorite-2'))).toBeTruthy();
      });
    });

    it('handles empty favorites and loading states', async () => {
      articlesStore.favoritesIsLoading = true;
      articlesStore.favoriteArticles = [];
      const { getByTestId, rerender } = renderFavoritesScreen();
      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();

      articlesStore.favoritesIsLoading = false;
      articlesStore.favoriteArticles = [];
      rerender(<FavoritesScreen />);

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
      });
    });

    it('handles favorite interactions successfully', async () => {
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

  describe('Authentication Context', () => {
    it('works with different authentication states', async () => {
      userStore.setUser(createMockUser({ username: 'authuser' }));
      const { getByTestId, rerender } = renderFavoritesScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
      });
      expect(articlesStore.loadFavoriteArticlesInitially).toHaveBeenCalled();

      userStore.forgetUser();
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(false);
      rerender(<FavoritesScreen />);

      expect(getByTestId(TEST_IDS.FAVORITES_SCREEN)).toBeTruthy();
    });
  });
});
