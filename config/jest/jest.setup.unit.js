// Mock expo modules
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true]),
}));

jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        apiUrl: 'http://localhost:3000/api',
      },
    },
  },
}));

// Mock react-native-safe-area-context — uses the simple variant (no React.createElement)
jest.mock('react-native-safe-area-context', () => {
  const { createSafeAreaMock } = require('./setupUtils');
  return createSafeAreaMock(false);
});

// Mock react-native-ui-lib
jest.mock('react-native-ui-lib', () => {
  const ReactNative = require('react-native');
  return {
    ...ReactNative,
    View: ReactNative.View,
    Text: ReactNative.Text,
    Button: ReactNative.TouchableOpacity,
    TextField: ReactNative.TextInput,
    Card: ReactNative.View,
  };
});

// Mock navigation
jest.mock('rn-navio', () => ({
  navio: {
    setRoot: jest.fn(),
  },
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  NavigationContainer: ({ children }) => children,
}));

// Mock axios with proper interceptors
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
      clear: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
      clear: jest.fn(),
    },
  },
  defaults: {
    headers: {
      common: {},
    },
  },
};

jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Mock utilities
jest.mock('../../src/utils/alertUtils', () => ({
  showErrorAlert: jest.fn(),
  showInfoAlert: jest.fn(),
}));

jest.mock('../../src/utils/errors', () => ({
  showErrorModals: jest.fn(),
}));

// Mock services
jest.mock('../../src/services/navigationService', () => ({
  navigationService: {
    navigateToLoginScreen: jest.fn(),
    navigateToSignUpScreen: jest.fn(),
    navigateToMainTabs: jest.fn(),
    navigateToAuthTabs: jest.fn(),
    navigateToNewArticle: jest.fn(),
    navigateToEditProfile: jest.fn(),
    navigateToAuthorProfile: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => true),
  },
}));

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  log: jest.fn(),
  error: jest.fn(),
};
