import { useCallback, useEffect } from 'react';

import { articlesStore } from '../../store';
import { userStore } from '../../store/userStore';

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
  };
};

export { useFavoriteArticles };
