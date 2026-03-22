import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import {
  typeDefs as politicianQueryTypeDefs,
  getPoliticianResolver,
} from './politician/politicianQueries';

const baseQueryTypeDef = `#graphql
  type Query {
    _empty: String
  }
`;

const baseQueryResolver = {
  Query: {
    getPolitician: getPoliticianResolver,
  },
};

export const typeDefs = mergeTypeDefs([
  ...politicianQueryTypeDefs,
  baseQueryTypeDef,
]);
export const resolvers = mergeResolvers([baseQueryResolver]);
