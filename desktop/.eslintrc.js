module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    // 格式化使用prettier
    'prettier/prettier': 0,
    // 单引号
    quotes: [2, 'single'],
    // function前面不要多余的空格
    'space-before-function-paren': [0, 'always'],
    // 分号
    // semi: [2, 'always'],
  },
}
