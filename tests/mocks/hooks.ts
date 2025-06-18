import { mockDeep, MockProxy } from 'jest-mock-extended';

import { UseAuthorProfileReturn } from '../types';

import { mockArticles } from './data';

const mockUseAuthorProfileData = mockDeep<UseAuthorProfileReturn>();

mockUseAuthorProfileData.authorProfile = {
  username: 'testauthor',
  bio: 'Test bio',
  image: '',
  following: false,
};
mockUseAuthorProfileData.authorArticles = mockArticles;
mockUseAuthorProfileData.isLoading = false;

jest.mock('../../src/screens/authorProfile/useAuthorProfile', () => ({
  useAuthorProfile: () => mockUseAuthorProfileData,
}));

export const getMockUseAuthorProfile = (): MockProxy<UseAuthorProfileReturn> =>
  mockUseAuthorProfileData;

export const resetAllHookMocks = (): void => {
  jest.clearAllMocks();

  mockUseAuthorProfileData.authorProfile = {
    username: 'testauthor',
    bio: 'Test bio',
    image: '',
    following: false,
  };
  mockUseAuthorProfileData.authorArticles = mockArticles;
  mockUseAuthorProfileData.isLoading = false;
};
