module.exports = {
  setupFiles: [],
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
  },
  testRegex: '.*\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleDirectories: ['src', 'node_modules'],
  testPathIgnorePatterns: ['<rootDir>/es/', '<rootDir>/lib/', '<rootDir>/packages/workspace/node_modules/'],
};
