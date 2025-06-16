module.exports = {
  displayName: 'Unit Tests',
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-ui-lib|uilib-native|rn-navio|expo-.*|@expo/.*|@testing-library/react-native)/)',
  ],
  testMatch: ['**/tests/unit/**/*.(ts|tsx|js|jsx)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 10000,
};
