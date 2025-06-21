import { useCallback, useEffect } from 'react';

import { navigationService } from '../../services';
import { articlesStore } from '../../store';

const useArticles = () => {
  const handleLoadMoreArticles = useCallback(() => {
    articlesStore.loadMoreHomeArticles();
  }, []);

  const handleRefreshArticles = useCallback(() => {
    articlesStore.refreshHomeArticles();
  }, []);

  const handleGlobalFeedPress = useCallback(() => {
    articlesStore.switchToGlobalFeed();
  }, []);

  const handleUserFeedPress = useCallback(() => {
    articlesStore.switchToUserFeed();
  }, []);

  const handleFavoritePress = useCallback(
    async (slug: string, favorited: boolean) => {
      await articlesStore.toggleArticleFavoriteStatus(slug, favorited);
    },
    []
  );

  const handleArticlePress = useCallback((slug: string) => {
    const article = articlesStore.homeArticles.find(a => a.slug === slug);
    if (article) {
      navigationService.navigateToAuthorProfile(article.author.username);
    }
  }, []);

  useEffect(() => {
    articlesStore.loadHomeArticlesInitially();
  }, []);

  return {
    articles: articlesStore.homeArticles,
    isLoading: articlesStore.homeIsLoading,
    articlesCount: articlesStore.homeArticlesCount,
    feedType: articlesStore.feedType,
    loadMoreArticles: handleLoadMoreArticles,
    refreshArticles: handleRefreshArticles,
    handleGlobalFeedPress,
    handleUserFeedPress,
    handleFavoritePress,
    handleArticlePress,
  };
};

export default useArticles;
