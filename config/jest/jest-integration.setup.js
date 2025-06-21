import { cleanup } from '@testing-library/react-native';

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
}));

const suppressedErrors = [
  /(.*Use PascalCase for React components, or lowercase for HTML elements.)/,
  /React does not recognize the.*prop on a DOM element|Unknown event handler property/,
  /is using uppercase HTML/,
  /Received `true` for a non-boolean attribute `accessible`/,
  /Warning: forwardRef render functions do not support propTypes.*/,
  /An update to .* inside a test was not wrapped in act/,
  /Failed to .* storage:/,
  /Failed to .* token .* storage:/,
  /Failed to .* user data .* storage:/,
];

const suppressedWarnings = [
  /Animated: `useNativeDriver` is not supported.*/,
  /Method has been deprecated/,
  /An update to .* inside a test was not wrapped in act/,
];

const realConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    suppressedErrors.some(err => message.match(err))
  ) {
    return;
  }
  realConsoleError(...args);
};

const realConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    suppressedWarnings.some(err => message.match(err))
  ) {
    return;
  }
  realConsoleWarn(...args);
};

afterEach(cleanup);