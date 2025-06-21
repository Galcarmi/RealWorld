import { render, fireEvent, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { FeedType } from '../../../src/constants/feedTypes';
import { TEST_IDS } from '../../../src/constants/testIds';
import { HomeScreen } from '../../../src/screens/homeScreen/homeScreen';
import { createMockUser, createMockArticle } from '../../mocks/data';
import * as storeMocks from '../../mocks/stores';

const articlesStore = storeMocks.getArticlesStore();
const userStore = storeMocks.getUserStore();

const renderHomeScreen = () => {
  return render(<HomeScreen />);
};

describe('Home Screen Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    articlesStore.homeArticles = [
      createMockArticle({ slug: 'article-1', title: 'Test Article 1' }),
      createMockArticle({ slug: 'article-2', title: 'Test Article 2' }),
    ];
    articlesStore.homeIsLoading = false;
    articlesStore.feedType = FeedType.GLOBAL;
    articlesStore.homeArticlesCount = 2;
  });

  describe('Article Management', () => {
    it('initializes and displays articles with proper loading behavior', async () => {
      const { getByTestId } = renderHomeScreen();

      expect(articlesStore.loadHomeArticlesInitially).toHaveBeenCalledTimes(1);

      expect(getByTestId(TEST_IDS.HOME_SCREEN)).toBeTruthy();
      await waitFor(() => {
        expect(getByTestId(TEST_IDS.ARTICLE_CARD('article-1'))).toBeTruthy();
        expect(getByTestId(TEST_IDS.ARTICLE_CARD('article-2'))).toBeTruthy();
      });
    });

    it('handles empty states based on feed type', async () => {
      articlesStore.homeArticles = [];
      articlesStore.feedType = FeedType.GLOBAL;

      const { getByText } = renderHomeScreen();
      await waitFor(() => {
        expect(getByText('No articles available')).toBeTruthy();
      });
    });

    it('handles user feed empty state', async () => {
      articlesStore.homeArticles = [];
      articlesStore.feedType = FeedType.FEED;

      const { getByText } = renderHomeScreen();
      await waitFor(() => {
        expect(
          getByText('Follow some users to see their articles here')
        ).toBeTruthy();
      });
    });

    it('handles loading states correctly', () => {
      articlesStore.homeIsLoading = true;
      articlesStore.homeArticles = [];

      const { getByTestId } = renderHomeScreen();

      expect(getByTestId(TEST_IDS.HOME_SCREEN)).toBeTruthy();
      expect(articlesStore.loadHomeArticlesInitially).toHaveBeenCalledTimes(1);
    });
  });

  describe('Authentication and Feed Management', () => {
    it('manages feed tabs based on authentication status', async () => {
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(false);
      const { queryByText, rerender } = renderHomeScreen();
      expect(queryByText('For You')).toBeNull();
      expect(queryByText('Following')).toBeNull();

      userStore.setUser(createMockUser());
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(true);
      rerender(<HomeScreen />);

      await waitFor(() => {
        expect(queryByText('For You')).toBeTruthy();
        expect(queryByText('Following')).toBeTruthy();
      });

      const followingTab = queryByText('Following');
      const forYouTab = queryByText('For You');

      fireEvent.press(followingTab!);
      expect(articlesStore.switchToUserFeed).toHaveBeenCalledTimes(1);

      fireEvent.press(forYouTab!);
      expect(articlesStore.switchToGlobalFeed).toHaveBeenCalledTimes(1);
    });
  });

  describe('User Interactions', () => {
    it('handles article interactions successfully', async () => {
      const toggleFavoriteSpy = jest.spyOn(
        articlesStore,
        'toggleArticleFavoriteStatus'
      );
      const { getByTestId, getAllByTestId } = renderHomeScreen();

      await waitFor(() => {
        const articleCard = getByTestId(TEST_IDS.ARTICLE_CARD('article-1'));
        fireEvent.press(articleCard);
        expect(articleCard).toBeTruthy();
      });

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
});
