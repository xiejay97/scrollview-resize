import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: 'scrollview-resize',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  collectCoverage: true,
  coverageDirectory: './coverage',
};
export default config;
