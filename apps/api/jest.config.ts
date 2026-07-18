import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@valorasec/shared$': '<rootDir>/../../packages/shared/src',
    '^@valorasec/analyzer$': '<rootDir>/../../packages/analyzer/src',
    '^@valorasec/test-utils$': '<rootDir>/../../packages/test-utils/src',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};

export default config;
