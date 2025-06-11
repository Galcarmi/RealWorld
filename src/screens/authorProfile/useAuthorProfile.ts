import { useCallback, useEffect, useMemo, useState } from 'react';

import { ProfileService } from '../../services';
import { Article, Profile } from '../../services/types';
import { articlesStore } from '../../store/articlesStore';
import { authStore } from '../../store/authStore';
import { userStore } from '../../store/userStore';

export const useAuthorProfile = (username: string) => {
  const [authorProfile, setAuthorProfile] = useState<Profile | null>(null);
  const [authorArticles, setAuthorArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const profileService = useMemo(
    () => new ProfileService(authStore, userStore),
    []
  );

  const fetchAuthorProfile = useCallback(async () => {
    if (!username) return;

    try {
      const response = await profileService.getProfile(username);
      setAuthorProfile(response.profile);
    } catch {
      // Error handled by service layer
    }
  }, [username, profileService]);

  const fetchAuthorArticles = useCallback(async () => {
    if (!username) return;

    setIsLoading(true);
    try {
      const response = await articlesStore.getUserArticles(username, 10, 0);
      setAuthorArticles(response.articles);
    } catch {
      // Error handled by store layer
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  const onFollowToggle = useCallback(async () => {
    if (!authorProfile) return;

    try {
      const response = authorProfile.following
        ? await profileService.unfollowUser(username)
        : await profileService.followUser(username);

      setAuthorProfile(response.profile);
    } catch {
      // Error handled by service layer
    }
  }, [authorProfile, username, profileService]);

  const onToggleFavorite = useCallback(
    async (slug: string, favorited: boolean) => {
      await articlesStore.toggleArticleFavoriteStatus(slug, favorited);
      await fetchAuthorArticles();
    },
    [fetchAuthorArticles]
  );

  const refreshAuthorArticles = useCallback(async () => {
    await fetchAuthorArticles();
  }, [fetchAuthorArticles]);

  useEffect(() => {
    fetchAuthorProfile();
    fetchAuthorArticles();
  }, [username, fetchAuthorProfile, fetchAuthorArticles]);

  return {
    authorProfile,
    authorArticles,
    isLoading,
    onFollowToggle,
    onToggleFavorite,
    refreshAuthorArticles,
  };
};
