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
  statements: 80,
  branches: 65,
  functions: 80,
  lines: 80,
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
  coveragePathIgnorePatterns: [
  "/node_modules/",
  "src/swagger.ts",
  "src/config/db.ts",
  "src/database/connection.ts","/src/logger/",
  "/src/controllers/chatController.ts",
  "/src/middlewares/authController.ts",
  "/src/middlewares/verifyToken.ts",
  "/src/middlewares/errorHandler.ts"
],
};
