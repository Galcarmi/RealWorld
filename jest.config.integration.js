module.exports = {
  displayName: 'Integration Tests',
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/config/jest/jest.cleanup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: ['babel-preset-expo'],
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-ui-lib|react-native-reanimated|react-native-gesture-handler|uilib-native|rn-navio|expo-.*|@expo/.*|@testing-library/react-native)/)',
  ],
  testMatch: ['<rootDir>/tests/integration/**/*.(test|spec).(ts|tsx|js|jsx)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(png|jpg|jpeg|gif|svg|ttf|woff|woff2|eot|otf)$': 'identity-obj-proxy',
  },
  testEnvironment: 'node',
  testTimeout: 15000,
};
