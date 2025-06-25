import { useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslation } from '../../hooks/useTranslation';
import {
  Article,
  Comment,
  articleService,
  navigationService,
} from '../../services';
import { articlesStore } from '../../store';
import { showErrorAlert } from '../../utils';

export const useArticle = (slug?: string) => {
  const { t } = useTranslation();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);

  const fetchArticle = useCallback(async () => {
    if (!slug) return;

    setIsLoadingArticle(true);
    try {
      const response = await articleService.getArticle(slug);
      setArticle(response.article);
    } catch {
      showErrorAlert(t('errors.failedToFetchArticle'));
    } finally {
      setIsLoadingArticle(false);
    }
  }, [slug, t]);

  const fetchComments = useCallback(async () => {
    if (!slug) return;

    setIsLoadingComments(true);
    try {
      const response = await articleService.getComments(slug);
      setComments(response.comments);
    } catch {
      showErrorAlert(t('errors.failedToFetchComments'));
    } finally {
      setIsLoadingComments(false);
    }
  }, [slug, t]);

  const isLoading = useMemo(() => {
    return isLoadingArticle || isLoadingComments;
  }, [isLoadingArticle, isLoadingComments]);

  const onFavoriteToggle = useCallback(async () => {
    if (!article) return;

    try {
      await articlesStore.toggleArticleFavoriteStatus(
        article.slug,
        article.favorited
      );
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

  const onDelete = useCallback(async () => {
    if (!article) return;
    try {
      await articleService.deleteArticle(article.slug);
      articlesStore.removeArticle(article.slug);
      navigationService.goBack();
    } catch {
      showErrorAlert(t('errors.failedToDeleteArticle'));
    }
  }, [article, t]);

  const onEdit = useCallback(() => {
    if (article?.slug) {
      navigationService.navigateToArticleForm(article.slug);
    }
  }, [article]);

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, [fetchArticle, fetchComments]);

  return {
    article,
    comments,
    isLoading,
    isLoadingComments,
    onFavoriteToggle,
    onAuthorPress,
    onDelete,
    onEdit,
  };
};
