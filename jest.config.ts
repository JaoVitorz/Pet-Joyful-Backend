export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: ['backend/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coveragethreshold: {
global: {
  statements: 0,
  branches: 0,
  function: 0,
  lines: 0,
}
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        esModuleInterop: true,
      },
    }],
  },
};
