import { useCallback, useEffect } from 'react';

import { userStore } from '../../store/userStore';

import { navigationService } from '../../services';
import { articlesStore } from '../../store';

const useFavoriteArticles = () => {
  const handleLoadMoreArticles = useCallback(() => {
    articlesStore.loadMoreFavoriteArticles();
  }, []);

  const handleRefreshArticles = useCallback(() => {
    articlesStore.refreshFavoriteArticles();
  }, []);

  const handleFavoritePress = useCallback(
    async (slug: string, favorited: boolean) => {
      await articlesStore.toggleArticleFavoriteStatus(slug, favorited);
    },
    []
  );

  const handleArticlePress = useCallback((slug: string) => {
    navigationService.navigateToArticle(slug);
  }, []);

  const handleAuthorPress = useCallback((username: string) => {
    navigationService.navigateToAuthorProfile(username);
  }, []);

  useEffect(() => {
    if (userStore.user?.username) {
      articlesStore.loadFavoriteArticlesInitially();
    }
  }, []);

  return {
    articles: articlesStore.favoriteArticles,
    isLoading: articlesStore.favoritesIsLoading,
    articlesCount: articlesStore.favoritesArticlesCount,
    loadMoreArticles: handleLoadMoreArticles,
    refreshArticles: handleRefreshArticles,
    handleFavoritePress,
    handleArticlePress,
    handleAuthorPress,
  };
};

export { useFavoriteArticles };
