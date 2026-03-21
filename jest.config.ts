export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: ['backend/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
global: {
  statements: 90,
  branches: 90,
  functions: 90,
  lines: 83.7,
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
