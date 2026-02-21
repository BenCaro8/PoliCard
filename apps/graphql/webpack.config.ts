import path from 'path';
import { Configuration as WebpackConfiguration, IgnorePlugin } from 'webpack';

const config: WebpackConfiguration = {
  entry: './src/server.ts',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'module',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  experiments: {
    topLevelAwait: true,
    outputModule: true,
  },
  target: 'node',
  optimization: {
    nodeEnv: false,
  },
  plugins: [
    new IgnorePlugin({
      resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
    }),
  ],
};

export default config;
