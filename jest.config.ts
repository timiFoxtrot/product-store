export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/controllers/**/*.ts',
    '<rootDir>/src/services/**/*.ts',
    '<rootDir>/src/models/**/*.ts',
    '<rootDir>/src/repositories/**/*.ts',
  ],
  clearMocks: true,
  coverageDirectory: `./coverage`,
};
