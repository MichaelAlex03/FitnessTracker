module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'controller/**/*.js',
      'middleware/**/*.js',
      'utils/**/*.js',
      '!**/__tests__/**',
      '!**/node_modules/**'
    ],
    testMatch: ['**/__tests__/**/*.test.js']
  };