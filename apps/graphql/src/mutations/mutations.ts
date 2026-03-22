import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import {
  typeDefs as politicianMutationTypeDefs,
  runPoliticianIngestionResolver,
} from './politician/politicianMutations';

const baseMutationTypeDef = `#graphql
  type Mutation {
    _empty: String
  }
`;

const baseMutationResolver = {
  Mutation: {
    runPoliticianIngestion: runPoliticianIngestionResolver,
  },
};

export const typeDefs = mergeTypeDefs([
  ...politicianMutationTypeDefs,
  baseMutationTypeDef,
]);
export const resolvers = mergeResolvers([baseMutationResolver]);
