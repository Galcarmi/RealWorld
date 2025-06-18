import { RouteProp } from '@react-navigation/native';
import { mockDeep } from 'jest-mock-extended';

import { RootStackParamList } from '../../src/navigation/types';
import { MockNavigationFunctions, MockRoute } from '../types';

export const mockNavigationFunctions = mockDeep<MockNavigationFunctions>();

export const mockAuthorProfileRoute: RouteProp<
  RootStackParamList,
  'AuthorProfile'
> = {
  key: 'AuthorProfile',
  name: 'AuthorProfile',
  params: { username: 'testauthor' },
};

let mockCurrentRoute: MockRoute = mockAuthorProfileRoute;

export const setMockRoute = (route: MockRoute) => {
  mockCurrentRoute = route;
};

export const setMockRouteParams = (
  params: RootStackParamList[keyof RootStackParamList]
) => {
  if (mockCurrentRoute && 'params' in mockCurrentRoute) {
    (
      mockCurrentRoute as MockRoute & {
        params: RootStackParamList[keyof RootStackParamList];
      }
    ).params = params;
  }
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigationFunctions,
  useRoute: () => mockCurrentRoute,
}));

export const getMockNavigation = (): MockNavigationFunctions =>
  mockNavigationFunctions;
export const getMockRoute = (): MockRoute => mockCurrentRoute;

export const resetAllNavigationMocks = (): void => {
  jest.clearAllMocks();
  mockCurrentRoute = mockAuthorProfileRoute;
};
