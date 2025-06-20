import '@testing-library/jest-native/extend-expect';

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

jest.mock('react-native-safe-area-context', () => {
  const { createSafeAreaMock } = require('./setupUtils');
  return createSafeAreaMock(true);
});

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
