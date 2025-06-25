import { runInAction } from 'mobx';

import { FeedType } from '../../src/constants/feedTypes';
import { articlesStore } from '../../src/store/articlesStore';
import { authStore } from '../../src/store/authStore';
import { userStore } from '../../src/store/userStore';

const authStoreSpies: { [key: string]: jest.SpyInstance } = {};
const userStoreSpies: { [key: string]: jest.SpyInstance } = {};
const articlesStoreSpies: { [key: string]: jest.SpyInstance } = {};

const setupAuthStoreSpies = () => {
  authStoreSpies.login = jest.spyOn(authStore, 'login');
  authStoreSpies.register = jest.spyOn(authStore, 'register');
  authStoreSpies.logout = jest.spyOn(authStore, 'logout');
};

const setupUserStoreSpies = () => {
  userStoreSpies.forgetUser = jest.spyOn(userStore, 'forgetUser');
  userStoreSpies.setUser = jest.spyOn(userStore, 'setUser');
  userStoreSpies.clearStorageOnAuthError = jest.spyOn(
    userStore,
    'clearStorageOnAuthError'
  );
};

const setupArticlesStoreSpies = () => {
  articlesStoreSpies.loadHomeArticlesInitially = jest.spyOn(
    articlesStore,
    'loadHomeArticlesInitially'
  );
  articlesStoreSpies.loadMoreHomeArticles = jest.spyOn(
    articlesStore,
    'loadMoreHomeArticles'
  );
  articlesStoreSpies.refreshHomeArticles = jest.spyOn(
    articlesStore,
    'refreshHomeArticles'
  );
  articlesStoreSpies.switchToGlobalFeed = jest.spyOn(
    articlesStore,
    'switchToGlobalFeed'
  );
  articlesStoreSpies.switchToUserFeed = jest.spyOn(
    articlesStore,
    'switchToUserFeed'
  );
  articlesStoreSpies.loadFavoriteArticlesInitially = jest.spyOn(
    articlesStore,
    'loadFavoriteArticlesInitially'
  );
  articlesStoreSpies.loadMoreFavoriteArticles = jest.spyOn(
    articlesStore,
    'loadMoreFavoriteArticles'
  );
  articlesStoreSpies.refreshFavoriteArticles = jest.spyOn(
    articlesStore,
    'refreshFavoriteArticles'
  );
  articlesStoreSpies.getUserArticles = jest.spyOn(
    articlesStore,
    'getUserArticles'
  );
  articlesStoreSpies.createArticle = jest.spyOn(articlesStore, 'createArticle');
  articlesStoreSpies.toggleArticleFavoriteStatus = jest.spyOn(
    articlesStore,
    'toggleArticleFavoriteStatus'
  );
  articlesStoreSpies.removeArticle = jest.spyOn(articlesStore, 'removeArticle');
};

setupAuthStoreSpies();
setupUserStoreSpies();
setupArticlesStoreSpies();

export const resetAllStoreMocks = (): void => {
  authStore.clear();
  runInAction(() => {
    authStore.isLoading = false;
    authStore.errors = undefined;

    userStore.user = null;
    userStore.isInitialized = false;

    articlesStore.homeArticles = [];
    articlesStore.homeIsLoading = false;
    articlesStore.homeArticlesCount = 0;
    articlesStore.homeCurrentOffset = 0;
    articlesStore.homeErrors = undefined;
    articlesStore.feedType = FeedType.GLOBAL;

    articlesStore.favoriteArticles = [];
    articlesStore.favoritesIsLoading = false;
    articlesStore.favoritesArticlesCount = 0;
    articlesStore.favoritesCurrentOffset = 0;
    articlesStore.favoritesErrors = undefined;
  });

  Object.values(authStoreSpies).forEach(spy => spy.mockClear());
  Object.values(userStoreSpies).forEach(spy => spy.mockClear());
  Object.values(articlesStoreSpies).forEach(spy => spy.mockClear());
};

export const getAuthStoreSpies = () => authStoreSpies;
export const getUserStoreSpies = () => userStoreSpies;
export const getArticlesStoreSpies = () => articlesStoreSpies;

export const getAuthStore = () => authStore;
export const getUserStore = () => userStore;
export const getArticlesStore = () => articlesStore;
