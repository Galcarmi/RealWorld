import '@testing-library/jest-native/extend-expect';

// Suppress console warnings during tests (like inbox)
const suppressedErrors = [
  /(.*Use PascalCase for React components, or lowercase for HTML elements.)/,
  /React does not recognize the.*prop on a DOM element|Unknown event handler property/,
  /is using uppercase HTML/,
  /Received `true` for a non-boolean attribute `accessible`/,
  /The tag.*is unrecognized in this browser/,
  /Warning: forwardRef render functions do not support propTypes.*/,
  /An update to .* inside a test was not wrapped in act/,
];

const suppressedWarnings = [
  /Animated: `useNativeDriver` is not supported.*/,
  /Method has been deprecated/,
  /An update to .* inside a test was not wrapped in act/,
  /DeprecationWarning: 'now' property was accessed on \[Object\] after it was soft deleted/,
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

// Mock StatusBarManager for react-native-ui-lib
const { NativeModules } = require('react-native');
NativeModules.StatusBarManager = {
  getHeight: jest.fn(() => 20),
  HEIGHT: 20,
};

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const ReactNative = require('react-native');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) =>
      React.createElement(ReactNative.View, {}, children),
    SafeAreaView: ({ children, ...props }) =>
      React.createElement(ReactNative.View, props, children),
    useSafeAreaInsets: () => insets,
  };
});

// Mock Expo vector icons to prevent font loading issues
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  AntDesign: 'AntDesign',
  MaterialIcons: 'MaterialIcons',
  FontAwesome: 'FontAwesome',
  Feather: 'Feather',
}));

// Mock rn-navio
jest.mock('rn-navio', () => ({
  generateNavioStackNavigator: jest.fn(() => ({
    Stack: {
      Screen: ({ children }) => children,
      Navigator: ({ children }) => children,
    },
  })),
  navio: {
    setRoot: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    navigate: jest.fn(),
  },
}));

// Mock AuthService
jest.mock('./src/services/auth/AuthService', () => ({
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

// Mock utils with all the actual exported functions
jest.mock('./src/utils', () => ({
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
}));
