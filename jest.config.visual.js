module.exports = {
  displayName: 'Visual Tests',
  testMatch: ['**/tests/visual/**/*.(test|spec).(ts|tsx|js|jsx)'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
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
  testEnvironment: 'node',
  collectCoverageFrom: [
    'tests/visual/**/*.{ts,tsx,js,jsx}',
    '!tests/visual/**/*.d.ts',
  ],
  coverageDirectory: 'coverage/visual',
  coverageReporters: ['text', 'lcov', 'html'],
};
