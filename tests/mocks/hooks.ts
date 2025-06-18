import { mockArticles } from './data';

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

jest.mock('../../src/screens/authorProfile/useAuthorProfile', () => ({
  useAuthorProfile: () => mockUseAuthorProfileData,
}));

export const getMockUseAuthorProfile = () => mockUseAuthorProfileData;

export const resetAllHookMocks = (): void => {
  jest.clearAllMocks();

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
