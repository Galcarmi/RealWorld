module.exports = {
  displayName: 'Visual Tests',
  testMatch: ['**/tests/visual/**/*.(test|spec).(ts|tsx|js|jsx)'],
  testTimeout: 120000,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: ['module:metro-react-native-babel-preset'],
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(pixelmatch|pngjs)/)'],
  testEnvironment: 'node',
};
