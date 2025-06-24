import { useCallback, useEffect, useState } from 'react';

import { articlesStore } from '../../store/articlesStore';
import { userStore } from '../../store/userStore';

import { APP_PAGINATION } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import { Article, navigationService } from '../../services';
import { showErrorAlert } from '../../utils';

export const useProfile = () => {
  const { t } = useTranslation();
  const [userArticles, setUserArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = userStore.user;

  const fetchUserArticles = useCallback(async () => {
    if (!currentUser?.username) return;

    setIsLoading(true);
    try {
      const response = await articlesStore.getUserArticles(
        currentUser.username,
        APP_PAGINATION.DEFAULT_LIMIT,
        APP_PAGINATION.DEFAULT_OFFSET
      );
      setUserArticles(response.articles);
    } catch {
      showErrorAlert(t('errors.failedToFetchArticles'));
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.username, t]);

  const onCreateNewArticle = useCallback(() => {
    navigationService.navigateToNewArticle();
  }, []);

  const onEditProfile = useCallback(() => {
    navigationService.navigateToEditProfile();
  }, []);

  const onToggleFavorite = useCallback(
    async (slug: string, favorited: boolean) => {
      await articlesStore.toggleArticleFavoriteStatus(slug, favorited);
      await fetchUserArticles();
    },
    [fetchUserArticles]
  );

  const onArticlePress = useCallback((slug: string) => {
    navigationService.navigateToArticle(slug);
  }, []);

  const onAuthorPress = useCallback((username: string) => {
    navigationService.navigateToAuthorProfile(username);
  }, []);

  useEffect(() => {
    fetchUserArticles();
  }, [currentUser?.username, fetchUserArticles]);

  return {
    currentUser,
    userArticles,
    isLoading,
    onCreateNewArticle,
    onEditProfile,
    onToggleFavorite,
    onArticlePress,
    onAuthorPress,
    refreshUserArticles: fetchUserArticles,
  };
};
