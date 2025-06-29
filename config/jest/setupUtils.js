const insets = { top: 0, right: 0, bottom: 0, left: 0 };

const createSafeAreaMock = (withCreateElement = false) => {
  if (withCreateElement) {
    const React = require('react');
    const ReactNative = require('react-native');

    return {
      SafeAreaProvider: ({ children, ...props }) =>
        React.createElement(ReactNative.View, props, children),
      SafeAreaView: ({ children, ...props }) =>
        React.createElement(ReactNative.View, props, children),
      useSafeAreaInsets: () => insets,
    };
  }

  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => insets,
  };
};

module.exports = {
  insets,
  createSafeAreaMock,
};
