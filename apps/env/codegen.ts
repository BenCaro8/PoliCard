import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './daemon/graph/schema.graphqls',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
