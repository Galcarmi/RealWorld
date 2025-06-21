import React from 'react';
import '@testing-library/jest-native/extend-expect';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  AntDesign: 'AntDesign',
  MaterialIcons: 'MaterialIcons',
  FontAwesome: 'FontAwesome',
  Feather: 'Feather',
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

jest.mock('mobx-react', () => ({
  observer: (component: any) => component,
}));

jest.mock('expo-localization', () => ({
  locale: 'en-US',
  locales: ['en-US'],
  timezone: 'America/New_York',
  isoCurrencyCodes: ['USD'],
  region: 'US',
  isRTL: false,
}));
