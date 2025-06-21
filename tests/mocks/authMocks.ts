// Auth-specific mocks for integration tests

// Mock AsyncStorage for auth tests
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock mobx-react observer
jest.mock('mobx-react', () => ({
  observer: (component: any) => component,
}));

// Mock the stores
jest.mock('../../src/store/authStore', () => {
  const mockAuthStore = {
    isLoading: false,
    errors: undefined,
    username: '',
    email: '',
    password: '',
    get authValues() {
      return {
        email: this.email,
        username: this.username,
        password: this.password,
      };
    },
    get isLoginFormValid() {
      return this.email.length > 0 && this.password.length > 0;
    },
    get isSignUpFormValid() {
      return (
        this.username.length >= 3 &&
        this.email.length > 0 &&
        this.password.length >= 6
      );
    },
    clear: jest.fn(() => {
      mockAuthStore.username = '';
      mockAuthStore.email = '';
      mockAuthStore.password = '';
      mockAuthStore.errors = undefined;
      mockAuthStore.isLoading = false;
    }),
    setUsername: jest.fn((value: string) => {
      mockAuthStore.username = value;
    }),
    setEmail: jest.fn((value: string) => {
      mockAuthStore.email = value;
    }),
    setPassword: jest.fn((value: string) => {
      mockAuthStore.password = value;
    }),
    login: jest.fn(() => Promise.resolve()),
    register: jest.fn(() => Promise.resolve()),
    logout: jest.fn(() => Promise.resolve()),
  };

  return {
    authStore: mockAuthStore,
  };
});

jest.mock('../../src/store/userStore', () => ({
  userStore: {
    user: null,
    token: null,
    isInitialized: false,
    forgetUser: jest.fn(() => Promise.resolve()),
    setUser: jest.fn(() => Promise.resolve()),
    getToken: jest.fn(() => null),
    isAuthenticated: jest.fn(() => false),
    clearStorageOnAuthError: jest.fn(() => Promise.resolve()),
  },
}));

// Mock the useStore hook directly
jest.mock('../../src/screens/login/useStore', () => ({
  useStore: () => ({
    isLoading: false,
    user: {
      email: '',
      username: '',
      password: '',
    },
    errors: undefined,
  }),
}));

// Mock AuthService for auth flow tests
jest.mock('../../src/services/auth/AuthService', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    login: jest.fn(() =>
      Promise.resolve({
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
      })
    ),
    register: jest.fn(() =>
      Promise.resolve({
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
      })
    ),
    updateUser: jest.fn(() =>
      Promise.resolve({
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
      })
    ),
    logout: jest.fn(() => Promise.resolve()),
  })),
}));

// Mock navigation service for auth tests
jest.mock('../../src/services/navigationService', () => ({
  navigationService: {
    navigateToMainTabs: jest.fn(),
    navigateToAuthTabs: jest.fn(),
    navigateToLoginScreen: jest.fn(),
    navigateToSignUpScreen: jest.fn(),
    navigateToEditProfile: jest.fn(),
    navigateToNewArticle: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    navigate: jest.fn(),
    setRoot: jest.fn(),
  },
}));

// Mock translation hooks
jest.mock('../../src/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'placeholders.username': 'Username',
        'placeholders.email': 'Email',
        'placeholders.password': 'Password',
        'validation.usernameRequired': 'Username is required',
        'validation.usernameTooShort': 'Username is too short',
        'validation.emailRequired': 'Email is required',
        'validation.emailInvalid': 'Email is invalid',
        'validation.passwordRequired': 'Password is required',
        'validation.passwordTooShort': 'Password is too short',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock react-native-ui-lib components
jest.mock('react-native-ui-lib', () => {
  const ReactNative = require('react-native');
  return {
    View: ReactNative.View,
    Text: ReactNative.Text,
    Button: ReactNative.TouchableOpacity,
    Avatar: ReactNative.View,
    TextField: ReactNative.TextInput,
    Colors: {
      loadColors: jest.fn(),
    },
    Typography: {
      loadTypographies: jest.fn(),
    },
  };
});

// Mock utilities - matching original Jest setup
jest.mock('../../src/utils', () => ({
  showErrorAlert: jest.fn(),
  showInfoAlert: jest.fn(),
  showConfirmAlert: jest.fn(),
  showErrorModals: jest.fn(),
  formatDate: jest.fn(() => '2023-01-01'),
  emailValidation: jest.fn(() => true),
  lengthValidation: jest.fn(() => jest.fn(() => true)),
  getInitials: jest.fn(
    (name, length) => name?.substring(0, length || 2).toUpperCase() || ''
  ),
  getUserInitial: jest.fn(name => name?.charAt(0).toUpperCase() || ''),
  StorageUtils: {
    setUserToken: jest.fn(() => Promise.resolve()),
    getUserToken: jest.fn(() => Promise.resolve(null)),
    setUserData: jest.fn(() => Promise.resolve()),
    getUserData: jest.fn(() => Promise.resolve(null)),
    clearUserData: jest.fn(() => Promise.resolve()),
  },
}));

// Export the mocked AsyncStorage for tests that need direct access
export const mockAsyncStorage = require('@react-native-async-storage/async-storage');
