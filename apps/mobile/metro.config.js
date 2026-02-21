// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.alias = {
  '@gql': './__generated__/gql.ts',
  '@graphql': './__generated__/graphql.ts',
};
defaultConfig.resolver.disableHierarchicalLookup = true;

defaultConfig.resolver.assetExts.push('glsl');

module.exports = defaultConfig;
