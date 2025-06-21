import React from 'react';
import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-gesture-handler', () => {
  const ReactNative = require('react-native');
  return {
    Swipeable: ReactNative.View,
    DrawerLayout: ReactNative.View,
    State: {},
    ScrollView: ReactNative.ScrollView,
    Slider: ReactNative.View,
    Switch: ReactNative.Switch,
    TextInput: ReactNative.TextInput,
    ToolbarAndroid: ReactNative.View,
    ViewPagerAndroid: ReactNative.View,
    DrawerLayoutAndroid: ReactNative.View,
    WebView: ReactNative.View,
    NativeViewGestureHandler: ReactNative.View,
    TapGestureHandler: ReactNative.View,
    FlingGestureHandler: ReactNative.View,
    ForceTouchGestureHandler: ReactNative.View,
    LongPressGestureHandler: ReactNative.View,
    PanGestureHandler: ReactNative.View,
    PinchGestureHandler: ReactNative.View,
    RotationGestureHandler: ReactNative.View,
    RawButton: ReactNative.TouchableOpacity,
    BaseButton: ReactNative.TouchableOpacity,
    RectButton: ReactNative.TouchableOpacity,
    BorderlessButton: ReactNative.TouchableOpacity,
    FlatList: ReactNative.FlatList,
    gestureHandlerRootHOC: jest.fn(component => component),
    Directions: {},
  };
});

const { NativeModules } = require('react-native');
NativeModules.StatusBarManager = {
  getHeight: jest.fn(() => 20),
  HEIGHT: 20,
};

// Mock react-native-ui-lib components
jest.mock('react-native-ui-lib', () => {
  const React = require('react');
  const ReactNative = require('react-native');
  return {
    View: ReactNative.View,
    Text: ReactNative.Text,
    Button: ({ label, testID, disabled, ...props }: any) =>
      React.createElement(
        ReactNative.View,
        {
          accessible: true,
          accessibilityState: { disabled: !!disabled },
          testID,
          ...props,
        },
        label && React.createElement(ReactNative.Text, null, label)
      ),
    Avatar: ReactNative.View,
    TextField: ReactNative.TextInput,
    Card: ReactNative.View,
    Colors: {
      loadColors: jest.fn(),
    },
    Typography: {
      loadTypographies: jest.fn(),
    },
  };
});

// Mock the translation hook
jest.mock('../../src/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'empty.noFavoriteArticles': 'No favorite articles yet',
        'empty.noArticlesFound': 'No articles found',
        'empty.followUsersMessage':
          'Follow some users to see their articles here',
        'empty.noArticlesAvailable': 'No articles available',
        'empty.noUserArticles':
          "No articles yet. Tap 'New Article' to create your first post",
        'common.back': 'Back',
        'common.loading': 'Loading...',
        'common.publish': 'Publish',
        'feed.forYou': 'For You',
        'feed.following': 'Following',
        'feed.global': 'Global',
        'navigation.profile': 'Profile',
        'navigation.newArticle': 'New Article',
        'placeholders.username': 'Username',
        'placeholders.email': 'Email',
        'placeholders.password': 'Password',
        'placeholders.title': 'Article Title',
        'placeholders.description': 'Article Description',
        'placeholders.articleText': 'Write your article content...',
        'auth.signIn': 'Sign In',
        'auth.signUp': 'Sign Up',
        'auth.submit': 'Submit',
        'errors.failedToFetchArticles': 'Failed to fetch articles',
        'errors.failedToCreateArticle': 'Failed to create article',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock navigation service
jest.mock('../../src/services/navigationService', () => ({
  navigationService: {
    navigateToMainTabs: jest.fn(),
    navigateToAuthTabs: jest.fn(),
    navigateToLoginScreen: jest.fn(),
    navigateToSignUpScreen: jest.fn(),
    navigateToEditProfile: jest.fn(),
    navigateToNewArticle: jest.fn(),
    navigateToAuthorProfile: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    navigate: jest.fn(),
    setRoot: jest.fn(),
  },
}));

// Mock mobx-react observer
jest.mock('mobx-react', () => ({
  observer: (component: any) => component,
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  AntDesign: 'AntDesign',
  MaterialIcons: 'MaterialIcons',
  FontAwesome: 'FontAwesome',
  Feather: 'Feather',
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-localization', () => ({
  locale: 'en-US',
  locales: ['en-US'],
  timezone: 'America/New_York',
  isoCurrencyCodes: ['USD'],
  region: 'US',
  isRTL: false,
}));

jest.mock('rn-navio', () => ({
  generateNavioStackNavigator: jest.fn(() => ({
    Stack: {
      Screen: ({ children }: { children: React.ReactNode }) => children,
      Navigator: ({ children }: { children: React.ReactNode }) => children,
    },
  })),
  navio: {
    setRoot: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    navigate: jest.fn(),
  },
}));

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
  })),
}));

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

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const ReactNative = require('react-native');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children, testID, ...props }: any) =>
      React.createElement(ReactNative.View, { testID, ...props }, children),
    useSafeAreaInsets: () => insets,
  };
});
