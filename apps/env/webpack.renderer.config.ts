import type { Configuration } from 'webpack';
import path from 'path';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
  target: 'electron-renderer',
  externalsPresets: { electronRenderer: true, node: true },
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias: {
      '@gql': path.resolve(__dirname, '__generated__/gql.ts'),
      '@graphql': path.resolve(__dirname, '__generated__/graphql.ts'),
      '@/*': path.resolve(__dirname, '*'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
