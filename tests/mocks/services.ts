import { mockDeep, mockReset, MockProxy } from 'jest-mock-extended';

import { NavioInstance } from '../../src/navigation/navio';
import { IAuthService, IArticleService } from '../../src/services/types';

// Create interface for NavigationService based on the actual class
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

// Mock the services using jest-mock-extended
const mockNavigationService = mockDeep<INavigationService>();
const mockAuthService = mockDeep<IAuthService>();
const mockArticleService = mockDeep<IArticleService>();

// Jest module mocks
jest.mock('../../src/services/navigationService', () => ({
  navigationService: mockNavigationService,
}));

jest.mock('../../src/services/auth/AuthService', () => ({
  AuthService: jest.fn().mockImplementation(() => mockAuthService),
}));

jest.mock('../../src/services/articles/ArticleService', () => ({
  ArticleService: jest.fn().mockImplementation(() => mockArticleService),
}));

// Export typed mock instances for use in tests
export const getMockNavigationService = (): MockProxy<INavigationService> =>
  mockNavigationService;
export const getMockAuthService = (): MockProxy<IAuthService> =>
  mockAuthService;
export const getMockArticleService = (): MockProxy<IArticleService> =>
  mockArticleService;

// Helper to reset all mocks
export const resetAllServiceMocks = (): void => {
  mockReset(mockNavigationService);
  mockReset(mockAuthService);
  mockReset(mockArticleService);
};
