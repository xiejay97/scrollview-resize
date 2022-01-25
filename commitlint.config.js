'use strict';

const types = ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'perf', 'test'];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', types],
    'body-max-length': [0],
    'body-max-line-length': [0],
  },
};
