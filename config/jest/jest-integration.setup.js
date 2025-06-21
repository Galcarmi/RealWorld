import { cleanup } from '@testing-library/react-native';

// Mock the Logger with TestLogger for tests - must be at the top for proper hoisting
jest.mock('../../src/utils/Logger', () => {
  const debug = require('debug');

  // Create different debug instances for different log levels
  const logDebug = debug('test:log');
  const errorDebug = debug('test:error');
  const warnDebug = debug('test:warn');
  const infoDebug = debug('test:info');

  return {
    Logger: {
      log: (message, ...args) => logDebug(message, ...args),
      error: (message, ...args) => errorDebug(message, ...args),
      warn: (message, ...args) => warnDebug(message, ...args),
      info: (message, ...args) => infoDebug(message, ...args),
      debug: (message, ...args) => logDebug(message, ...args),
    },
  };
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

beforeEach(() => {
  jest.clearAllMocks();
});

// Suppress common React Testing Library warnings that don't affect test results
const suppressedWarnings = [
  /An update to .* inside a test was not wrapped in act/,
  /You are trying to `import` a file after the Jest environment has been torn down/,
  /Cannot log after tests are done/,
  /Did you forget to wait for something async in your test/,
  /Animated: `useNativeDriver` is not supported/,
  /Warning: forwardRef render functions do not support propTypes/,
];

const suppressedErrors = [
  /An update to .* inside a test was not wrapped in act/,
  /You are trying to `import` a file after the Jest environment has been torn down/,
  /Cannot log after tests are done/,
  /Did you forget to wait for something async in your test/,
];

const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    suppressedWarnings.some(pattern => pattern.test(message))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    suppressedErrors.some(pattern => pattern.test(message))
  ) {
    return;
  }
  originalConsoleError(...args);
};

afterEach(cleanup);
