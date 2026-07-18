import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  rootDir: '..',
  testEnvironment: 'node',
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@valorasec/shared$': '<rootDir>/../../packages/shared/src',
    '^@valorasec/analyzer$': '<rootDir>/../../packages/analyzer/src',
    '^@valorasec/test-utils$': '<rootDir>/../../packages/test-utils/src',
  },
};

export default config;
