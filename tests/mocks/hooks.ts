import { mockArticles } from './data';

// Mock useAuthorProfile hook data
const mockUseAuthorProfileData = {
  authorProfile: {
    username: 'testauthor',
    bio: 'Test bio',
    image: '',
    following: false,
  } as any,
  authorArticles: mockArticles,
  isLoading: false,
  onFollowToggle: jest.fn(),
  onToggleFavorite: jest.fn(),
  refreshAuthorArticles: jest.fn(),
};

// Jest module mock for useAuthorProfile
jest.mock('../../src/screens/authorProfile/useAuthorProfile', () => ({
  useAuthorProfile: () => mockUseAuthorProfileData,
}));

// Export for use in tests
export const getMockUseAuthorProfile = () => mockUseAuthorProfileData;

// Helper to reset all hook mocks
export const resetAllHookMocks = (): void => {
  jest.clearAllMocks();

  // Reset to default values
  mockUseAuthorProfileData.authorProfile = {
    username: 'testauthor',
    bio: 'Test bio',
    image: '',
    following: false,
  } as any;
  mockUseAuthorProfileData.authorArticles = mockArticles;
  mockUseAuthorProfileData.isLoading = false;
  mockUseAuthorProfileData.onFollowToggle = jest.fn();
  mockUseAuthorProfileData.onToggleFavorite = jest.fn();
  mockUseAuthorProfileData.refreshAuthorArticles = jest.fn();
};
