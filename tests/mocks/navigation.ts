import { RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '../../src/navigation/types';

export const mockNavigationFunctions = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

export const mockAuthorProfileRoute: RouteProp<
  RootStackParamList,
  'AuthorProfile'
> = {
  key: 'AuthorProfile',
  name: 'AuthorProfile',
  params: { username: 'testauthor' },
};

let mockCurrentRoute = mockAuthorProfileRoute;

export const setMockRoute = (route: any) => {
  mockCurrentRoute = route;
};

export const setMockRouteParams = (params: any) => {
  if (mockCurrentRoute && 'params' in mockCurrentRoute) {
    (mockCurrentRoute as any).params = params;
  }
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigationFunctions,
  useRoute: () => mockCurrentRoute,
}));

export const getMockNavigation = () => mockNavigationFunctions;
export const getMockRoute = () => mockCurrentRoute;

export const resetAllNavigationMocks = (): void => {
  jest.clearAllMocks();
  mockCurrentRoute = mockAuthorProfileRoute;
};
