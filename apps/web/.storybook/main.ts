import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.html$/,
            use: ['html-loader'],
          },
          {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve('babel-loader'),
              },
            ],
          },
          {
            test: /\.scss$/i,
            use: [
              // Creates `style` nodes from JS strings
              'style-loader',
              // Translates CSS into CommonJS
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                },
              },
              'postcss-loader',
              {
                loader: 'sass-loader',
                options: { implementation: require.resolve('sass') },
              },
              ,
            ],
          },
          {
            test: /\.css$/i, // separated out as tailwind uses global scope not modules...
            use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
        ],
      },
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      reactOptions: {
        fastRefresh: true,
      },
    },
  },
};
export default config;
