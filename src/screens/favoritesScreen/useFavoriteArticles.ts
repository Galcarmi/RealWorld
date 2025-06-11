import { useCallback, useEffect } from 'react';

import { navigationService } from '../../services/navigationService';
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

  const handleArticlePress = useCallback((slug: string) => {
    const article = articlesStore.favoriteArticles.find(a => a.slug === slug);
    if (article) {
      navigationService.navigateToAuthorProfile(article.author.username);
    }
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
  };
};

export { useFavoriteArticles };
