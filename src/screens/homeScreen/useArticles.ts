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
    navigationService.navigateToArticle(slug);
  }, []);

  const handleAuthorPress = useCallback((username: string) => {
    navigationService.navigateToAuthorProfile(username);
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
    handleAuthorPress,
  };
};

export default useArticles;
