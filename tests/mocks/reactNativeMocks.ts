import React from 'react';

// Mock React Native core modules
jest.mock('react-native', () => {
  const React = require('react');

  // Create mock components
  const View = (props: any) => React.createElement('View', props);
  const Text = (props: any) => React.createElement('Text', props);
  const TextInput = (props: any) => React.createElement('TextInput', props);
  const TouchableOpacity = (props: any) =>
    React.createElement('TouchableOpacity', props);
  const ScrollView = (props: any) => React.createElement('ScrollView', props);
  const ActivityIndicator = (props: any) =>
    React.createElement('ActivityIndicator', props);

  return {
    Alert: {
      alert: jest.fn(),
    },
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StyleSheet: {
      create: jest.fn(styles => styles),
    },
    Keyboard: {
      dismiss: jest.fn(),
    },
    NativeModules: {
      StatusBarManager: {
        getHeight: jest.fn(() => 20),
        HEIGHT: 20,
      },
    },
    Dimensions: {
      get: jest.fn(() => ({
        width: 375,
        height: 812,
      })),
    },
    Platform: {
      OS: 'ios',
      select: jest.fn(options => options.ios || options.default),
    },
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo vector icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const ReactNative = require('react-native');

  const createIconComponent =
    (name: string) =>
    ({ size, color, testID, ...props }: any) =>
      React.createElement(
        ReactNative.Text,
        {
          testID: testID || `${name}-icon`,
          style: { fontSize: size, color },
          ...props,
        },
        name
      );

  return {
    Ionicons: createIconComponent('Ionicons'),
    MaterialIcons: createIconComponent('MaterialIcons'),
    FontAwesome: createIconComponent('FontAwesome'),
    AntDesign: createIconComponent('AntDesign'),
    Entypo: createIconComponent('Entypo'),
    EvilIcons: createIconComponent('EvilIcons'),
    Feather: createIconComponent('Feather'),
    FontAwesome5: createIconComponent('FontAwesome5'),
    Foundation: createIconComponent('Foundation'),
    MaterialCommunityIcons: createIconComponent('MaterialCommunityIcons'),
    Octicons: createIconComponent('Octicons'),
    SimpleLineIcons: createIconComponent('SimpleLineIcons'),
    Zocial: createIconComponent('Zocial'),
  };
});

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
    TextField: ReactNative.TextInput,
    Colors: {
      loadColors: jest.fn(),
    },
    Typography: {
      loadTypographies: jest.fn(),
    },
  };
});

// Mock SafeAreaProvider
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

// Mock translation hook
jest.mock('../../src/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'auth.signIn': 'Sign In',
        'auth.signUp': 'Sign Up',
        'placeholders.email': 'Email',
        'placeholders.password': 'Password',
        'placeholders.username': 'Username',
        'placeholders.bio': 'Bio',
        'placeholders.articleTitle': 'Article Title',
        'placeholders.articleDescription': 'Article Description',
        'placeholders.articleBody': 'Article Body',
        'common.edit': 'Edit',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.loading': 'Loading...',
        'errors.required': 'This field is required',
        'errors.invalidEmail': 'Invalid email format',
        'errors.passwordTooShort': 'Password must be at least 6 characters',
        'errors.usernameTooShort': 'Username must be at least 3 characters',
        'profile.editProfile': 'Edit Profile',
        'profile.newArticle': 'New Article',
        'articles.noArticles': 'No articles yet',
        'articles.noFavorites': 'No favorite articles yet',
        'articles.loadingArticles': 'Loading articles...',
        'navigation.profile': 'Profile',
        'empty.noUserArticles':
          "No articles yet. Tap 'New Article' to create your first post",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock ProfileScreen specific components
jest.mock('../../src/components/ProfileHeader', () => {
  const React = require('react');
  const ReactNative = require('react-native');
  return {
    ProfileHeader: ({ user, onEditProfile, testID, ...props }: any) =>
      React.createElement(
        ReactNative.View,
        { testID: testID || 'profile-header', ...props },
        [
          React.createElement(
            ReactNative.Text,
            { key: 'username' },
            user?.username || 'Unknown User'
          ),
          React.createElement(
            ReactNative.TouchableOpacity,
            {
              key: 'edit-button',
              testID: 'edit-profile-button',
              onPress: onEditProfile,
            },
            React.createElement(ReactNative.Text, null, 'Edit Profile')
          ),
        ]
      ),
  };
});

jest.mock('../../src/components/ScreenHeader', () => {
  const React = require('react');
  const ReactNative = require('react-native');
  return {
    ScreenHeader: ({ title, testID, ...props }: any) =>
      React.createElement(
        ReactNative.View,
        { testID: testID || 'screen-header', ...props },
        React.createElement(ReactNative.Text, null, title || 'Screen Header')
      ),
  };
});

jest.mock('../../src/components/NewArticleButton', () => {
  const React = require('react');
  const ReactNative = require('react-native');
  return {
    NewArticleButton: ({ onPress, testID, ...props }: any) =>
      React.createElement(
        ReactNative.TouchableOpacity,
        {
          testID: testID || 'new-article-button',
          onPress,
          ...props,
        },
        React.createElement(ReactNative.Text, null, 'New Article')
      ),
  };
});

jest.mock('../../src/components/ArticlesList', () => {
  const React = require('react');
  const ReactNative = require('react-native');
  return {
    ArticlesList: ({
      articles,
      isLoading,
      emptyMessage,
      testID,
      ...props
    }: any) => {
      if (isLoading) {
        return React.createElement(
          ReactNative.View,
          { testID: testID || 'articles-list', ...props },
          React.createElement(ReactNative.ActivityIndicator, null)
        );
      }

      if (!articles || articles.length === 0) {
        return React.createElement(
          ReactNative.View,
          { testID: testID || 'articles-list', ...props },
          React.createElement(
            ReactNative.Text,
            null,
            emptyMessage || 'No articles'
          )
        );
      }

      return React.createElement(
        ReactNative.View,
        { testID: testID || 'articles-list', ...props },
        articles.map((article: any, index: number) =>
          React.createElement(
            ReactNative.View,
            { key: index, testID: `article-${index}` },
            React.createElement(
              ReactNative.Text,
              null,
              article.title || 'Article Title'
            )
          )
        )
      );
    },
  };
});
