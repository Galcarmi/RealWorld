import { useCallback, useEffect, useMemo, useState } from 'react';

import { articlesStore } from '../../store/articlesStore';
import { userStore } from '../../store/userStore';

import { Article, Profile } from '../../services/types';

import { APP_PAGINATION } from '../../constants';
import { ProfileService } from '../../services';
import { Logger } from '../../utils';

export const useAuthorProfile = (username: string) => {
  const [authorProfile, setAuthorProfile] = useState<Profile | null>(null);
  const [authorArticles, setAuthorArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const profileService = useMemo(() => new ProfileService(userStore), []);

  const fetchAuthorProfile = useCallback(async () => {
    if (!username) return;

    try {
      const response = await profileService.getProfile(username);
      setAuthorProfile(response.profile);
    } catch (error) {
      Logger.error('Failed to fetch author profile:', error);
    }
  }, [username, profileService]);

  const loadAuthorArticles = useCallback(async () => {
    if (!username) return;

    setIsLoading(true);
    try {
      const response = await articlesStore.getUserArticles(
        username,
        APP_PAGINATION.DEFAULT_LIMIT,
        APP_PAGINATION.DEFAULT_OFFSET
      );
      setAuthorArticles(response.articles);
    } catch (error) {
      Logger.error('Failed to load author articles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  const fetchAuthorArticles = useCallback(async () => {
    await loadAuthorArticles();
  }, [loadAuthorArticles]);

  const toggleUserFollowStatus = useCallback(async () => {
    if (!authorProfile) return;

    try {
      const response = authorProfile.following
        ? await profileService.unfollowUser(username)
        : await profileService.followUser(username);

      setAuthorProfile(response.profile);
    } catch (error) {
      Logger.error('Failed to toggle follow status:', error);
    }
  }, [authorProfile, username, profileService]);

  const onFollowToggle = useCallback(async () => {
    await toggleUserFollowStatus();
  }, [toggleUserFollowStatus]);

  const handleFavoriteToggle = useCallback(
    async (slug: string, favorited: boolean) => {
      await articlesStore.toggleArticleFavoriteStatus(slug, favorited);
      await fetchAuthorArticles();
    },
    [fetchAuthorArticles]
  );

  const onToggleFavorite = useCallback(
    async (slug: string, favorited: boolean) => {
      await handleFavoriteToggle(slug, favorited);
    },
    [handleFavoriteToggle]
  );

  const refreshAuthorArticles = useCallback(async () => {
    await fetchAuthorArticles();
  }, [fetchAuthorArticles]);

  const initializeAuthorData = useCallback(() => {
    fetchAuthorProfile();
    fetchAuthorArticles();
  }, [fetchAuthorProfile, fetchAuthorArticles]);

  useEffect(() => {
    initializeAuthorData();
  }, [username, initializeAuthorData]);

  return {
    authorProfile,
    authorArticles,
    isLoading,
    onFollowToggle,
    onToggleFavorite,
    refreshAuthorArticles,
  };
};
