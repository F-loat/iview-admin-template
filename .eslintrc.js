module.exports = {
  'root': true,
  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  'rules': {
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    'no-underscore-dangle': 0
  }
}