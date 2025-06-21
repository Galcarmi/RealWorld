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

  describe('Screen Initialization', () => {
    it('initializes and loads articles on mount', async () => {
      renderHomeScreen();

      expect(articlesStore.loadHomeArticlesInitially).toHaveBeenCalledTimes(1);
    });

    it('renders home screen with correct test ID', () => {
      const { getByTestId } = renderHomeScreen();

      expect(getByTestId(TEST_IDS.HOME_SCREEN)).toBeTruthy();
    });
  });

  describe('Articles Display', () => {
    it('displays articles from store', async () => {
      const { getByTestId } = renderHomeScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.ARTICLE_CARD('article-1'))).toBeTruthy();
        expect(getByTestId(TEST_IDS.ARTICLE_CARD('article-2'))).toBeTruthy();
      });
    });

    it('shows loading state when articles are loading', () => {
      articlesStore.homeIsLoading = true;
      articlesStore.homeArticles = [];

      const { getByTestId } = renderHomeScreen();

      expect(getByTestId(TEST_IDS.HOME_SCREEN)).toBeTruthy();
    });

    it('handles empty article list for global feed', async () => {
      articlesStore.homeArticles = [];
      articlesStore.feedType = FeedType.GLOBAL;

      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        expect(getByText('No articles available')).toBeTruthy();
      });
    });

    it('handles empty article list for user feed', async () => {
      articlesStore.homeArticles = [];
      articlesStore.feedType = FeedType.FEED;

      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        expect(
          getByText('Follow some users to see their articles here')
        ).toBeTruthy();
      });
    });
  });

  describe('Authentication', () => {
    it('hides feed tabs for unauthenticated users', () => {
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(false);

      const { queryByText } = renderHomeScreen();

      expect(queryByText('For You')).toBeNull();
      expect(queryByText('Following')).toBeNull();
    });

    it('shows feed tabs for authenticated users', async () => {
      userStore.setUser(createMockUser());
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(true);

      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        expect(getByText('For You')).toBeTruthy();
        expect(getByText('Following')).toBeTruthy();
      });
    });
  });

  describe('Feed Switching', () => {
    beforeEach(() => {
      userStore.setUser(createMockUser());
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(true);
    });

    it('integrates global feed tab with store', async () => {
      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        const forYouTab = getByText('For You');
        fireEvent.press(forYouTab);
      });

      expect(articlesStore.switchToGlobalFeed).toHaveBeenCalledTimes(1);
    });

    it('integrates user feed tab with store', async () => {
      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        const followingTab = getByText('Following');
        fireEvent.press(followingTab);
      });

      expect(articlesStore.switchToUserFeed).toHaveBeenCalledTimes(1);
    });
  });

  describe('Article Interaction', () => {
    it('handles article card press integration', async () => {
      const { getByTestId } = renderHomeScreen();

      await waitFor(() => {
        const articleCard = getByTestId(TEST_IDS.ARTICLE_CARD('article-1'));
        fireEvent.press(articleCard);
      });

      expect(getByTestId(TEST_IDS.ARTICLE_CARD('article-1'))).toBeTruthy();
    });

    it('integrates favorite button with articles store', async () => {
      const toggleFavoriteSpy = jest.spyOn(
        articlesStore,
        'toggleArticleFavoriteStatus'
      );
      const { getAllByTestId } = renderHomeScreen();

      await waitFor(() => {
        const favoriteButtons = getAllByTestId(
          TEST_IDS.FAVORITE_BUTTON('testauthor')
        );
        fireEvent.press(favoriteButtons[0]);
      });

      expect(toggleFavoriteSpy).toHaveBeenCalled();
    });
  });

  describe('Feed Type State', () => {
    beforeEach(() => {
      userStore.setUser(createMockUser());
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(true);
    });

    it('maintains global feed state correctly', async () => {
      articlesStore.feedType = FeedType.GLOBAL;

      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        expect(getByText('For You')).toBeTruthy();
      });

      expect(articlesStore.feedType).toBe(FeedType.GLOBAL);
    });

    it('maintains user feed state correctly', async () => {
      articlesStore.feedType = FeedType.FEED;

      const { getByText } = renderHomeScreen();

      await waitFor(() => {
        expect(getByText('Following')).toBeTruthy();
      });

      expect(articlesStore.feedType).toBe(FeedType.FEED);
    });
  });

  describe('Multiple Article Interactions', () => {
    it('handles multiple article card presses', async () => {
      const { getByTestId } = renderHomeScreen();

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.ARTICLE_CARD('article-1')));
      });

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.ARTICLE_CARD('article-2')));
      });

      expect(getByTestId(TEST_IDS.ARTICLE_CARD('article-1'))).toBeTruthy();
      expect(getByTestId(TEST_IDS.ARTICLE_CARD('article-2'))).toBeTruthy();
    });

    it('handles multiple favorite button presses', async () => {
      const toggleFavoriteSpy = jest.spyOn(
        articlesStore,
        'toggleArticleFavoriteStatus'
      );
      const { getAllByTestId } = renderHomeScreen();

      const favoriteButtons = getAllByTestId(
        TEST_IDS.FAVORITE_BUTTON('testauthor')
      );

      await waitFor(() => {
        fireEvent.press(favoriteButtons[0]);
      });

      await waitFor(() => {
        fireEvent.press(favoriteButtons[1]);
      });

      expect(toggleFavoriteSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Feed Switching', () => {
    beforeEach(() => {
      userStore.setUser(createMockUser());
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
      articlesStore.homeArticles = [];
      articlesStore.homeIsLoading = false;

      const { getByText } = renderHomeScreen();

      expect(getByText('No articles available')).toBeTruthy();
    });

    it('should still call loadHomeArticlesInitially even if articles store is empty', () => {
      articlesStore.homeArticles = [];

      renderHomeScreen();

      expect(articlesStore.loadHomeArticlesInitially).toHaveBeenCalledTimes(1);
    });
  });
});
