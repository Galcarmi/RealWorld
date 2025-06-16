import { mockDeep, mockReset, MockProxy } from 'jest-mock-extended';

import { FeedType } from '../../src/constants/feedTypes';
import { IAuthStore, IUserStore, IArticlesStore } from '../../src/store/types';

// Create typed mocks using jest-mock-extended
const mockAuthStore = mockDeep<IAuthStore>();
const mockUserStore = mockDeep<IUserStore>();
const mockArticlesStore = mockDeep<IArticlesStore>();

// Set up default values for observables
mockAuthStore.isLoading = false;
mockAuthStore.errors = undefined;
mockAuthStore.username = '';
mockAuthStore.email = '';
mockAuthStore.password = '';

mockUserStore.user = null;
mockUserStore.token = null;

mockArticlesStore.homeArticles = [];
mockArticlesStore.homeIsLoading = false;
mockArticlesStore.homeArticlesCount = 0;
mockArticlesStore.homeCurrentOffset = 0;
mockArticlesStore.feedType = FeedType.GLOBAL;
mockArticlesStore.favoriteArticles = [];
mockArticlesStore.favoritesIsLoading = false;
mockArticlesStore.favoritesArticlesCount = 0;
mockArticlesStore.favoritesCurrentOffset = 0;

// Set up default implementations for getters
Object.defineProperty(mockAuthStore, 'authValues', {
  get: () => ({
    email: mockAuthStore.email,
    username: mockAuthStore.username,
    password: mockAuthStore.password,
  }),
  configurable: true,
});

Object.defineProperty(mockAuthStore, 'isLoginFormValid', {
  get: () =>
    mockAuthStore.email.length > 0 && mockAuthStore.password.length > 0,
  configurable: true,
});

Object.defineProperty(mockAuthStore, 'isSignUpFormValid', {
  get: () =>
    mockAuthStore.username.length >= 3 &&
    mockAuthStore.email.length > 0 &&
    mockAuthStore.password.length >= 6,
  configurable: true,
});

// Set up default mock implementations for common methods
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

mockAuthStore.login.mockImplementation(() => {
  mockAuthStore.isLoading = true;
});

mockAuthStore.register.mockImplementation(() => {
  mockAuthStore.isLoading = true;
});

mockUserStore.forgetUser.mockImplementation(() => {
  mockUserStore.user = null;
  mockUserStore.token = null;
});

mockUserStore.setUser.mockImplementation((user: any) => {
  mockUserStore.user = user;
  mockUserStore.token = user?.token || null;
});

mockUserStore.getToken.mockImplementation(() => mockUserStore.token);
mockUserStore.isAuthenticated.mockImplementation(() => !!mockUserStore.user);

mockArticlesStore.getUserArticles.mockResolvedValue({ articles: [] });

// Jest module mocks
jest.mock('../../src/store/authStore', () => ({
  authStore: mockAuthStore,
}));

jest.mock('../../src/store/userStore', () => ({
  userStore: mockUserStore,
}));

jest.mock('../../src/store/articlesStore', () => ({
  articlesStore: mockArticlesStore,
}));

// Export typed mock instances for use in tests
export const getMockAuthStore = (): MockProxy<IAuthStore> => mockAuthStore;
export const getMockUserStore = (): MockProxy<IUserStore> => mockUserStore;
export const getMockArticlesStore = (): MockProxy<IArticlesStore> =>
  mockArticlesStore;

// Helper to reset all store mocks
export const resetAllStoreMocks = (): void => {
  mockReset(mockAuthStore);
  mockReset(mockUserStore);
  mockReset(mockArticlesStore);

  // Re-apply default values after reset
  mockAuthStore.isLoading = false;
  mockAuthStore.errors = undefined;
  mockAuthStore.username = '';
  mockAuthStore.email = '';
  mockAuthStore.password = '';

  mockUserStore.user = null;
  mockUserStore.token = null;

  mockArticlesStore.homeArticles = [];
  mockArticlesStore.homeIsLoading = false;
  mockArticlesStore.homeArticlesCount = 0;
};
