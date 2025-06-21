import { mockDeep, MockProxy } from 'jest-mock-extended';

import { NavioInstance } from '../../src/navigation/navio';
import { ArticleService } from '../../src/services/articles/ArticleService';
import { AuthService } from '../../src/services/auth/AuthService';
import { ProfileService } from '../../src/services/profiles/ProfileService';
import {
  IArticleService,
  IAuthService,
  IProfileService,
} from '../../src/services/types';
import { StorageUtils } from '../../src/utils/storageUtils';

import { mockUser, mockArticle, mockArticles } from './data';

interface INavigationService {
  setNavioInstance: (navioInstance: NavioInstance) => void;
  setRoot: (rootType: 'stacks' | 'tabs' | 'drawers', rootName: string) => void;
  navigateToMainTabs: () => void;
  navigateToAuthTabs: () => void;
  navigateToLoginScreen: () => void;
  navigateToSignUpScreen: () => void;
  navigateToNewArticle: () => void;
  navigateToEditProfile: () => void;
  navigateToAuthorProfile: (username: string) => void;
  goBack: () => void;
}

const mockNavigationService = mockDeep<INavigationService>();
const mockAuthService = mockDeep<IAuthService>();
const mockArticleService = mockDeep<IArticleService>();
const mockProfileService = mockDeep<IProfileService>();

jest.mock('../../src/services/navigationService', () => ({
  navigationService: mockNavigationService,
}));

jest.mock('../../src/services/auth/AuthService', () => ({
  AuthService: jest.fn().mockImplementation(() => mockAuthService),
}));

jest.mock('../../src/services/articles/ArticleService', () => ({
  ArticleService: jest.fn().mockImplementation(() => mockArticleService),
}));

jest.mock('../../src/services/profiles/ProfileService', () => ({
  ProfileService: jest.fn().mockImplementation(() => mockProfileService),
}));

export const getMockNavigationService = (): MockProxy<INavigationService> =>
  mockNavigationService;
export const createMockAuthService = (): MockProxy<AuthService> => {
  return mockDeep<AuthService>();
};

export const setupServiceMocks = () => {
  const mockAuthServiceClass = AuthService as jest.MockedClass<
    typeof AuthService
  >;
  mockAuthServiceClass.mockImplementation(
    () =>
      ({
        login: jest.fn().mockResolvedValue({
          user: mockUser,
        }),
        register: jest.fn().mockResolvedValue({
          user: mockUser,
        }),
        validateStoredToken: jest.fn().mockResolvedValue({
          user: mockUser,
        }),
        getCurrentUser: jest.fn().mockResolvedValue({
          user: mockUser,
        }),
        updateUser: jest.fn().mockResolvedValue({
          user: mockUser,
        }),
      }) as any
  );

  const mockArticleServiceClass = ArticleService as jest.MockedClass<
    typeof ArticleService
  >;
  mockArticleServiceClass.mockImplementation(
    () =>
      ({
        getArticles: jest.fn().mockResolvedValue({
          articles: mockArticles,
          articlesCount: mockArticles.length,
        }),
        getFeedArticles: jest.fn().mockResolvedValue({
          articles: mockArticles,
          articlesCount: mockArticles.length,
        }),
        createArticle: jest.fn().mockResolvedValue({
          article: mockArticle,
        }),
        favoriteArticle: jest.fn().mockResolvedValue({
          article: {
            ...mockArticle,
            favorited: true,
            favoritesCount: mockArticle.favoritesCount + 1,
          },
        }),
        unfavoriteArticle: jest.fn().mockResolvedValue({
          article: {
            ...mockArticle,
            favorited: false,
            favoritesCount: mockArticle.favoritesCount,
          },
        }),
      }) as any
  );

  const mockProfileServiceClass = ProfileService as jest.MockedClass<
    typeof ProfileService
  >;
  mockProfileServiceClass.mockImplementation(
    () =>
      ({
        getProfile: jest.fn().mockResolvedValue({
          profile: mockArticle.author,
        }),
        followUser: jest.fn().mockResolvedValue({
          profile: {
            ...mockArticle.author,
            following: true,
          },
        }),
        unfollowUser: jest.fn().mockResolvedValue({
          profile: {
            ...mockArticle.author,
            following: false,
          },
        }),
      }) as any
  );

  jest.spyOn(StorageUtils, 'setUserToken').mockResolvedValue();
  jest.spyOn(StorageUtils, 'getUserToken').mockResolvedValue(mockUser.token);
  jest.spyOn(StorageUtils, 'setUserData').mockResolvedValue();
  jest.spyOn(StorageUtils, 'getUserData').mockResolvedValue(mockUser);
  jest.spyOn(StorageUtils, 'clearUserData').mockResolvedValue();
};

setupServiceMocks();
