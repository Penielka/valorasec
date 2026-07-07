import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  testEnvironment: 'node',
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@valorasec/shared$': '<rootDir>/../../packages/shared/src',
    '^@valorasec/analyzer$': '<rootDir>/../../packages/analyzer/src',
  },
};

export default config;
