import { useCallback, useEffect, useMemo, useState } from 'react';

import { FeedType } from '../../constants/feedTypes';
import { ArticleService } from '../../services';
import { Article } from '../../services/types';
import { authStore } from '../../store/authStore';
import { userStore } from '../../store/userStore';

const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [articlesCount, setArticlesCount] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [feedType, setFeedType] = useState<FeedType>(FeedType.GLOBAL);

  const articleService = useMemo(
    () => new ArticleService(authStore, userStore),
    []
  );

  const loadArticles = useCallback(
    async (offset = 0, reset = true) => {
      try {
        setIsLoading(true);

        const response =
          feedType === FeedType.GLOBAL
            ? await articleService.getArticles({ limit: 10, offset })
            : await articleService.getFeedArticles({ limit: 10, offset });

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
    [articleService, feedType]
  );

  const loadMoreArticles = useCallback(() => {
    if (!isLoading && articles.length < articlesCount) {
      loadArticles(currentOffset + 10, false);
    }
  }, [isLoading, articles.length, articlesCount, currentOffset, loadArticles]);

  const refreshArticles = useCallback(() => {
    loadArticles(0, true);
  }, [loadArticles]);

  const switchFeedType = useCallback((feedType: FeedType) => {
    setFeedType(feedType);
    setCurrentOffset(0);
  }, []);

  useEffect(() => {
    loadArticles(0, true);
  }, [feedType, loadArticles]);

  return {
    articles,
    isLoading,
    articlesCount,
    feedType,
    loadMoreArticles,
    refreshArticles,
    switchFeedType,
  };
};

export default useArticles;
