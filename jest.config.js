module.exports = {
  setupFiles: [`../../setupJestTests.ts`],
  testEnvironment: 'jsdom',
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
    '\\.(js|jsx)$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss)$': 'jest-transform-css',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleDirectories: ['src', 'node_modules'],
  testMatch: ['**/tests/**/*.test.[jt]s?(x)'],
  testPathIgnorePatterns: ['<rootDir>/lib/'],
};
