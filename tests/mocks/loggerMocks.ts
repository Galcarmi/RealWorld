import '@testing-library/jest-native/extend-expect';

// Console suppression for cleaner test output
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
