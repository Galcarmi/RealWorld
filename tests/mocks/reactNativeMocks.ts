import React from 'react';

// Since we're using jest-expo preset, it handles React Native core components automatically
// We only need to mock specific libraries and custom components

// AsyncStorage is already mocked by jest-expo preset
// No need for manual AsyncStorage mock

// Mock Expo vector icons - keep this as it's specific to your usage
jest.mock('@expo/vector-icons', () => {
  const React = require('react');

  const createIconComponent = (name: string) => (props: any) =>
    React.createElement('Text', { testID: `${name}-icon`, ...props }, name);

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

// Mock react-native-ui-lib components - keep this as it's library-specific
jest.mock('react-native-ui-lib', () => {
  const React = require('react');
  return {
    View: (props: any) => React.createElement('View', props),
    Text: (props: any) => React.createElement('Text', props),
    Button: (props: any) =>
      React.createElement(
        'View',
        {
          testID: props.testID,
          accessible: true,
          accessibilityState: { disabled: !!props.disabled },
        },
        props.label && React.createElement('Text', null, props.label)
      ),
    TextField: (props: any) => React.createElement('TextInput', props),
    Colors: { loadColors: jest.fn() },
    Typography: { loadTypographies: jest.fn() },
  };
});

// Mock SafeAreaProvider - keep this as it's commonly needed
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children, testID, ...props }: any) =>
      React.createElement('View', { testID, ...props }, children),
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

// Mock translation hook - keep this as it's app-specific
jest.mock('../../src/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock ProfileScreen specific components - keep these as they're app-specific
jest.mock('../../src/components/ProfileHeader', () => {
  const React = require('react');
  return {
    ProfileHeader: ({ user, onEditProfile, testID, ...props }: any) =>
      React.createElement(
        'View',
        { testID: testID || 'profile-header', ...props },
        [
          React.createElement(
            'Text',
            { key: 'username' },
            user?.username || 'Unknown User'
          ),
          React.createElement(
            'TouchableOpacity',
            {
              key: 'edit-button',
              testID: 'edit-profile-button',
              onPress: onEditProfile,
            },
            React.createElement('Text', null, 'Edit Profile')
          ),
        ]
      ),
  };
});

jest.mock('../../src/components/ScreenHeader', () => {
  const React = require('react');
  return {
    ScreenHeader: ({ title, testID, ...props }: any) =>
      React.createElement(
        'View',
        { testID: testID || 'screen-header', ...props },
        React.createElement('Text', null, title || 'Screen Header')
      ),
  };
});

jest.mock('../../src/components/NewArticleButton', () => {
  const React = require('react');
  return {
    NewArticleButton: ({ onPress, testID, ...props }: any) =>
      React.createElement(
        'TouchableOpacity',
        {
          testID: testID || 'new-article-button',
          onPress,
          ...props,
        },
        React.createElement('Text', null, 'New Article')
      ),
  };
});

jest.mock('../../src/components/ArticlesList', () => {
  const React = require('react');
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
          'View',
          { testID: testID || 'articles-list', ...props },
          React.createElement('ActivityIndicator', null)
        );
      }

      if (!articles || articles.length === 0) {
        return React.createElement(
          'View',
          { testID: testID || 'articles-list', ...props },
          React.createElement('Text', null, emptyMessage || 'No articles')
        );
      }

      return React.createElement(
        'View',
        { testID: testID || 'articles-list', ...props },
        articles.map((article: any, index: number) =>
          React.createElement(
            'View',
            { key: index, testID: `article-${index}` },
            React.createElement('Text', null, article.title || 'Article Title')
          )
        )
      );
    },
  };
});
