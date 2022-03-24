const path = require('path');

module.exports = {
  typescript: {
    check: true,
    checkOptions: {
      tsconfig: path.join(__dirname, '../tsconfig.json'),
    },
  },
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
  ],
  framework: '@storybook/react',
};
