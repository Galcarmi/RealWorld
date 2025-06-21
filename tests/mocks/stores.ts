import { mockDeep, mockReset, MockProxy } from 'jest-mock-extended';

import { FeedType } from '../../src/constants/feedTypes';
import {
  IAuthStore,
  IUserStore,
  IArticlesStore,
  User,
} from '../../src/store/types';

const mockAuthStore = mockDeep<IAuthStore>();
const mockUserStore = mockDeep<IUserStore>();
const mockArticlesStore = mockDeep<IArticlesStore>();

const setupAuthStoreMocks = () => {
  mockAuthStore.isLoading = false;
  mockAuthStore.errors = undefined;
  mockAuthStore.username = '';
  mockAuthStore.email = '';
  mockAuthStore.password = '';

  Object.defineProperty(mockAuthStore, 'authValues', {
    get: () => ({
      email: mockAuthStore.email,
      username: mockAuthStore.username,
      password: mockAuthStore.password,
    }),
    configurable: true,
  });

  Object.defineProperty(mockAuthStore, 'isLoginFormValid', {
    get: () => {
      const email = mockAuthStore.email || '';
      const password = mockAuthStore.password || '';
      return email.length > 0 && password.length > 0;
    },
    configurable: true,
  });

  Object.defineProperty(mockAuthStore, 'isSignUpFormValid', {
    get: () => {
      const username = mockAuthStore.username || '';
      const email = mockAuthStore.email || '';
      const password = mockAuthStore.password || '';
      return username.length >= 3 && email.length > 0 && password.length >= 6;
    },
    configurable: true,
  });

  mockAuthStore.clear.mockImplementation(() => {
    mockAuthStore.username = '';
    mockAuthStore.email = '';
    mockAuthStore.password = '';
    mockAuthStore.errors = undefined;
    mockAuthStore.isLoading = false;
  });

  mockAuthStore.setUsername.mockImplementation((value: string) => {
    mockAuthStore.username = value;
  });

  mockAuthStore.setEmail.mockImplementation((value: string) => {
    mockAuthStore.email = value;
  });

  mockAuthStore.setPassword.mockImplementation((value: string) => {
    mockAuthStore.password = value;
  });

  mockAuthStore.login.mockImplementation(async () => {
    mockAuthStore.isLoading = true;
  });

  mockAuthStore.register.mockImplementation(async () => {
    mockAuthStore.isLoading = true;
  });

  mockAuthStore.logout.mockImplementation(async () => {
    mockUserStore.user = null;
    mockUserStore.token = null;
  });
};

const setupUserStoreMocks = () => {
  mockUserStore.user = null;
  mockUserStore.token = null;
  mockUserStore.isInitialized = false;

  mockUserStore.forgetUser.mockImplementation(async () => {
    mockUserStore.user = null;
    mockUserStore.token = null;
  });

  mockUserStore.setUser.mockImplementation(async (user: User) => {
    mockUserStore.user = user;
    mockUserStore.token = user?.token || null;
  });

  mockUserStore.getToken.mockImplementation(() => mockUserStore.token);
  mockUserStore.isAuthenticated.mockImplementation(() => !!mockUserStore.user);
  mockUserStore.clearStorageOnAuthError.mockImplementation(async () => {
    mockUserStore.user = null;
    mockUserStore.token = null;
  });
};

const setupArticlesStoreMocks = () => {
  mockArticlesStore.homeArticles = [];
  mockArticlesStore.homeIsLoading = false;
  mockArticlesStore.homeArticlesCount = 0;
  mockArticlesStore.homeCurrentOffset = 0;
  mockArticlesStore.feedType = FeedType.GLOBAL;
  mockArticlesStore.favoriteArticles = [];
  mockArticlesStore.favoritesIsLoading = false;
  mockArticlesStore.favoritesArticlesCount = 0;
  mockArticlesStore.favoritesCurrentOffset = 0;

  // Add proper getter mocks
  Object.defineProperty(mockArticlesStore, 'canLoadMoreFavoriteArticles', {
    get: () =>
      !mockArticlesStore.favoritesIsLoading &&
      mockArticlesStore.favoriteArticles.length <
        mockArticlesStore.favoritesArticlesCount,
    configurable: true,
  });

  Object.defineProperty(mockArticlesStore, 'canLoadMoreHomeArticles', {
    get: () =>
      !mockArticlesStore.homeIsLoading &&
      mockArticlesStore.homeArticles.length <
        mockArticlesStore.homeArticlesCount,
    configurable: true,
  });

  // Mock all the async methods
  mockArticlesStore.loadFavoriteArticlesInitially.mockImplementation(
    async () => {
      // Just mark that it was called, don't modify state
    }
  );

  mockArticlesStore.loadMoreFavoriteArticles.mockImplementation(async () => {
    // Mock implementation
  });

  mockArticlesStore.refreshFavoriteArticles.mockImplementation(async () => {
    // Mock implementation
  });

  mockArticlesStore.loadHomeArticlesInitially.mockImplementation(async () => {
    // Mock implementation
  });

  mockArticlesStore.loadMoreHomeArticles.mockImplementation(async () => {
    // Mock implementation
  });

  mockArticlesStore.refreshHomeArticles.mockImplementation(async () => {
    // Mock implementation
  });

  mockArticlesStore.switchToGlobalFeed.mockImplementation(async () => {
    mockArticlesStore.feedType = FeedType.GLOBAL;
  });

  mockArticlesStore.switchToUserFeed.mockImplementation(async () => {
    mockArticlesStore.feedType = FeedType.FEED;
  });

  mockArticlesStore.toggleArticleFavoriteStatus.mockImplementation(async () => {
    // Mock implementation
  });

  mockArticlesStore.createArticle.mockImplementation(async () => {
    return {} as any;
  });

  mockArticlesStore.getUserArticles.mockImplementation(async () => {
    // Return immediately with empty articles for the test
    return {
      articles: [],
      articlesCount: 0,
    };
  });

  mockArticlesStore.clearHomeErrors.mockImplementation(() => {
    mockArticlesStore.homeErrors = undefined;
  });

  mockArticlesStore.clearFavoritesErrors.mockImplementation(() => {
    mockArticlesStore.favoritesErrors = undefined;
  });
};

setupAuthStoreMocks();
setupUserStoreMocks();
setupArticlesStoreMocks();

jest.mock('../../src/store/authStore', () => ({
  authStore: mockAuthStore,
}));

jest.mock('../../src/store/userStore', () => ({
  userStore: mockUserStore,
}));

jest.mock('../../src/store/articlesStore', () => ({
  articlesStore: mockArticlesStore,
}));

// Mock the main store index
jest.mock('../../src/store', () => ({
  authStore: mockAuthStore,
  userStore: mockUserStore,
  articlesStore: mockArticlesStore,
}));

export const getMockAuthStore = (): MockProxy<IAuthStore> => mockAuthStore;
export const getMockUserStore = (): MockProxy<IUserStore> => mockUserStore;
export const getMockArticlesStore = (): MockProxy<IArticlesStore> =>
  mockArticlesStore;

export const resetAllStoreMocks = (): void => {
  mockReset(mockAuthStore);
  mockReset(mockUserStore);
  mockReset(mockArticlesStore);

  setupAuthStoreMocks();
  setupUserStoreMocks();
  setupArticlesStoreMocks();
};
