import { useCallback, useEffect, useState } from 'react';

import { useTranslation } from '../../hooks/useTranslation';
import { Article, articleService, navigationService } from '../../services';
import { articlesStore } from '../../store';
import { showErrorAlert } from '../../utils';

export const useArticle = (slug: string) => {
  const { t } = useTranslation();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchArticle = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    try {
      const response = await articleService.getArticle(slug);
      setArticle(response.article);
    } catch {
      showErrorAlert(t('errors.failedToFetchArticle'));
    } finally {
      setIsLoading(false);
    }
  }, [slug, t]);

  const onFavoriteToggle = useCallback(async () => {
    if (!article) return;

    try {
      await articlesStore.toggleArticleFavoriteStatus(
        article.slug,
        article.favorited
      );
      // Refresh the article to get updated favorite count
      await fetchArticle();
    } catch {
      showErrorAlert(t('errors.failedToUpdateFavorite'));
    }
  }, [article, fetchArticle, t]);

  const onAuthorPress = useCallback(() => {
    if (article?.author?.username) {
      navigationService.navigateToAuthorProfile(article.author.username);
    }
  }, [article]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return {
    article,
    isLoading,
    onFavoriteToggle,
    onAuthorPress,
  };
};
