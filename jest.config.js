module.exports = {
  displayName: 'Unit Tests',
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/config/jest/jest.setup.unit.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-ui-lib|uilib-native|rn-navio|expo-.*|@expo/.*|@testing-library/react-native)/)',
  ],
  testMatch: ['<rootDir>/tests/unit/**/*.(test|spec).(ts|tsx|js|jsx)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 10000,
};
