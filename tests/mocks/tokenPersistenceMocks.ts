import React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage for token persistence tests
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock navigation service to prevent actual navigation
jest.mock('../../src/services/navigationService', () => ({
  navigationService: {
    navigateToMainTabs: jest.fn(),
    navigateToAuthTabs: jest.fn(),
    navigateToLoginScreen: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    navigate: jest.fn(),
    setRoot: jest.fn(),
  },
}));

// Mock react-native-gesture-handler
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

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  AntDesign: 'AntDesign',
  MaterialIcons: 'MaterialIcons',
  FontAwesome: 'FontAwesome',
  Feather: 'Feather',
}));

// Mock expo-localization
jest.mock('expo-localization', () => ({
  locale: 'en-US',
  locales: ['en-US'],
  timezone: 'America/New_York',
  isoCurrencyCodes: ['USD'],
  region: 'US',
  isRTL: false,
}));

// Mock rn-navio
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

// Mock Logger to prevent console errors during tests
jest.mock('../../src/utils/Logger', () => ({
  Logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

// Suppress console warnings and errors for cleaner test output
const suppressedErrors = [
  /(.*Use PascalCase for React components, or lowercase for HTML elements.)/,
  /React does not recognize the.*prop on a DOM element|Unknown event handler property/,
  /is using uppercase HTML/,
  /Received `true` for a non-boolean attribute `accessible`/,
  /Warning: forwardRef render functions do not support propTypes.*/,
  /An update to .* inside a test was not wrapped in act/,
];

const suppressedWarnings = [
  /Animated: `useNativeDriver` is not supported.*/,
  /Method has been deprecated/,
  /An update to .* inside a test was not wrapped in act/,
];

const realConsoleError = console.error;
console.error = message => {
  if (message?.match && suppressedErrors.some(err => message.match(err))) {
    return;
  }
  realConsoleError(message);
};

const realConsoleWarn = console.warn;
console.warn = message => {
  if (message?.match && suppressedWarnings.some(err => message.match(err))) {
    return;
  }
  realConsoleWarn(message);
};

// Export the mocked AsyncStorage for use in tests
export const mockAsyncStorage = AsyncStorage as jest.Mocked<
  typeof AsyncStorage
>;
