module.exports = {
  root: true,
  extends: 'standard',
  parser: 'typescript-eslint-parser',
  rules: {
    'semi': [ 'error', 'always' ],
    'comma-dangle': [ 'error', {
      'arrays': 'never',
      'objects': 'always-multiline',
      'imports': 'never',
      'exports': 'never',
      'functions': 'never'
    }]
  }
};
