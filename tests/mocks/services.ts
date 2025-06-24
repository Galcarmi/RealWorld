import { mockDeep, MockProxy } from 'jest-mock-extended';

import { NavioInstance } from '../../src/navigation/navio';
import {
  IArticleService,
  IAuthService,
  IProfileService,
} from '../../src/services';
import { StorageUtils } from '../../src/utils/storageUtils';

import { mockUser, mockArticle, mockArticles } from './data';

interface INavigationService {
  setNavioInstance: (navioInstance: NavioInstance) => void;
  setRoot: (rootType: 'stacks' | 'tabs' | 'drawers', rootName: string) => void;
  navigateToMainTabs: () => void;
  navigateToAuthTabs: () => void;
  navigateToLoginScreen: () => void;
  navigateToSignUpScreen: () => void;
  navigateToArticleForm: (slug?: string) => void;
  navigateToEditProfile: () => void;
  navigateToAuthorProfile: (username: string) => void;
  goBack: () => void;
}

const mockNavigationService = mockDeep<INavigationService>();
const mockAuthService = mockDeep<IAuthService>();
const mockArticleService = mockDeep<IArticleService>();
const mockProfileService = mockDeep<IProfileService>();

jest.mock('../../src/services', () => ({
  navigationService: mockNavigationService,
  authService: mockAuthService,
  articleService: mockArticleService,
  profileService: mockProfileService,
}));

export const getMockNavigationService = (): MockProxy<INavigationService> =>
  mockNavigationService;

export const createMockAuthService = (): MockProxy<any> => {
  return mockDeep<any>();
};

export const setupServiceMocks = () => {
  mockAuthService.login.mockResolvedValue({
    user: mockUser,
  });
  mockAuthService.register.mockResolvedValue({
    user: mockUser,
  });
  mockAuthService.validateStoredToken.mockResolvedValue({
    user: mockUser,
  });
  mockAuthService.getCurrentUser.mockResolvedValue({
    user: mockUser,
  });
  mockAuthService.updateUser.mockResolvedValue({
    user: mockUser,
  });

  mockArticleService.getArticles.mockResolvedValue({
    articles: mockArticles,
    articlesCount: mockArticles.length,
  });
  mockArticleService.getFeedArticles.mockResolvedValue({
    articles: mockArticles,
    articlesCount: mockArticles.length,
  });
  mockArticleService.createArticle.mockResolvedValue({
    article: mockArticle,
  });
  mockArticleService.favoriteArticle.mockResolvedValue({
    article: {
      ...mockArticle,
      favorited: true,
      favoritesCount: mockArticle.favoritesCount + 1,
    },
  });
  mockArticleService.unfavoriteArticle.mockResolvedValue({
    article: {
      ...mockArticle,
      favorited: false,
      favoritesCount: mockArticle.favoritesCount,
    },
  });

  mockProfileService.getProfile.mockResolvedValue({
    profile: mockArticle.author,
  });
  mockProfileService.followUser.mockResolvedValue({
    profile: {
      ...mockArticle.author,
      following: true,
    },
  });
  mockProfileService.unfollowUser.mockResolvedValue({
    profile: {
      ...mockArticle.author,
      following: false,
    },
  });

  jest.spyOn(StorageUtils, 'setUserData').mockResolvedValue();
  jest.spyOn(StorageUtils, 'getUserData').mockResolvedValue(mockUser);
  jest.spyOn(StorageUtils, 'clearUserData').mockResolvedValue();
};

setupServiceMocks();
