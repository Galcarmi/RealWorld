import { useCallback, useEffect, useState } from 'react';

import { articlesStore } from '../../store/articlesStore';
import { userStore } from '../../store/userStore';

import { navigationService } from '../../services/navigationService';
import { Article } from '../../services/types';

import { showErrorAlert } from '../../utils';

export const useProfile = () => {
  const [userArticles, setUserArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = userStore.user;

  const fetchUserArticles = useCallback(async () => {
    if (!currentUser?.username) return;

    setIsLoading(true);
    try {
      const response = await articlesStore.getUserArticles(
        currentUser.username,
        10,
        0
      );
      setUserArticles(response.articles);
    } catch {
      showErrorAlert('Failed to fetch articles');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.username]);

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
    refreshUserArticles: fetchUserArticles,
  };
};
