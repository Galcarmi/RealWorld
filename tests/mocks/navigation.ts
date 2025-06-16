import { RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '../../src/navigation/types';

// Mock navigation functions
export const mockNavigationFunctions = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

// Mock route for AuthorProfile screen
export const mockAuthorProfileRoute: RouteProp<
  RootStackParamList,
  'AuthorProfile'
> = {
  key: 'AuthorProfile',
  name: 'AuthorProfile',
  params: { username: 'testauthor' },
};

// Global mock route state that can be modified
let mockCurrentRoute = mockAuthorProfileRoute;

export const setMockRoute = (route: any) => {
  mockCurrentRoute = route;
};

export const setMockRouteParams = (params: any) => {
  if (mockCurrentRoute && 'params' in mockCurrentRoute) {
    (mockCurrentRoute as any).params = params;
  }
};

// Jest module mock for React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigationFunctions,
  useRoute: () => mockCurrentRoute,
}));

// Export for use in tests
export const getMockNavigation = () => mockNavigationFunctions;
export const getMockRoute = () => mockCurrentRoute;

// Helper to reset all navigation mocks
export const resetAllNavigationMocks = (): void => {
  jest.clearAllMocks();
  mockCurrentRoute = mockAuthorProfileRoute;
};
