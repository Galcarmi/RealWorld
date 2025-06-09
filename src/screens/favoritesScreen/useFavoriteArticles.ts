import { useCallback, useEffect, useMemo, useState } from 'react';

import { ArticleService } from '../../services';
import { Article } from '../../services/types';
import { authStore } from '../../store/authStore';
import { userStore } from '../../store/userStore';

const useFavoriteArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [articlesCount, setArticlesCount] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);

  const articleService = useMemo(
    () => new ArticleService(authStore, userStore),
    []
  );

  const loadFavoriteArticles = useCallback(
    async (offset = 0, reset = true) => {
      if (!userStore.user?.username) {
        return;
      }

      try {
        setIsLoading(true);

        const response = await articleService.getArticles({
          favorited: userStore.user.username,
          limit: 10,
          offset,
        });

        if (reset) {
          setArticles(response.articles);
          setCurrentOffset(offset);
        } else {
          setArticles(prev => [...prev, ...response.articles]);
          setCurrentOffset(offset);
        }

        setArticlesCount(response.articlesCount);
      } catch {
        // TODO add error handling
      } finally {
        setIsLoading(false);
      }
    },
    [articleService]
  );

  const loadMoreArticles = useCallback(() => {
    if (!isLoading && articles.length < articlesCount) {
      loadFavoriteArticles(currentOffset + 10, false);
    }
  }, [
    isLoading,
    articles.length,
    articlesCount,
    currentOffset,
    loadFavoriteArticles,
  ]);

  const refreshArticles = useCallback(() => {
    loadFavoriteArticles(0, true);
  }, [loadFavoriteArticles]);

  useEffect(() => {
    if (userStore.user?.username) {
      loadFavoriteArticles(0, true);
    }
  }, [loadFavoriteArticles]);

  return {
    articles,
    isLoading,
    articlesCount,
    loadMoreArticles,
    refreshArticles,
  };
};

export { useFavoriteArticles };
