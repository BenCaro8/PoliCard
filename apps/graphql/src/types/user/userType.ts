import { GraphQLError } from 'graphql';
import { dbPool } from '../../utils/aws';
import { UserResolvers } from '#gql-types';

export const UserType = `#graphql
  type User {
    id: String!
    email: String!
    name: String!
    metadata: UserMetadata
  }
`;

export const UserMetadataType = `#graphql
  type UserMetadata {
    explorerScore: Int!
    numLocationsDiscovered: Int!
  }
`;

export const UserResolver: UserResolvers = {
  metadata: async (_, __, context) => {
    const userId = context.res.locals.userInfo.id;
    try {
      const result = await dbPool.one(
        `SELECT
            explorer_score,
            (SELECT COUNT(*) FROM user_node_interactions WHERE user_id = $1) as num_locations_discovered
         FROM users
         WHERE user_id = $1`,
        [userId],
      );

      return result;
    } catch (err) {
      console.error('Error at field level metadata resolver: ', err);
      throw new GraphQLError('Error fetching user metadata');
    }
  },
};
