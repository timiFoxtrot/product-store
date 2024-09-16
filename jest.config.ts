// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   moduleFileExtensions: ['ts', 'js', 'json'],
//   roots: ['<rootDir>/src'],
//   testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
//   transform: {
//     '^.+\\.(t|j)s$': 'ts-jest',
//   },
//   collectCoverage: true,
//   clearMocks: true,
//   collectCoverageFrom: ['src/**/*.(t|j)s'],
//   coverageDirectory: './coverage',
//   coverageThreshold: {
//     global: {
//       branches: 80,
//       functions: 80,
//       lines: 80,
//       statements: 80,
//     },
//   },
// };

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/Refurbishment/**/*.ts'],
  clearMocks: true,
  coverageDirectory: `./coverage`,
};
