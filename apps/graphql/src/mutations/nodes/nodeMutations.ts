import { MutationResolvers } from '#gql-types';
import { dbPool } from '../../utils/aws';

const rateNodeInterestTypeDef = `#graphql
  extend type Mutation {
    rateNodeInterest(nodeId: String!, rating: Int!): Boolean! @auth
  }
`;

export const rateNodeInterestResolver: MutationResolvers['rateNodeInterest'] =
  async (_, { nodeId, rating }, context) => {
    const userId = context.res.locals.userInfo.id;

    try {
      if (rating === 0) {
        await dbPool.none(
          'DELETE FROM node_interest_ratings WHERE user_id = $1 AND node_id = $2',
          [userId, nodeId],
        );
      } else {
        await dbPool.none(
          `INSERT INTO node_interest_ratings (user_id, node_id, rating)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, node_id)
         DO UPDATE SET rating = EXCLUDED.rating, created_at = CURRENT_TIMESTAMP;`,
          [userId, nodeId, rating],
        );
      }

      return true;
    } catch (err) {
      console.error('Error rating node:', err);
      throw new Error('Failed to rate node');
    }
  };

export const typeDefs = [rateNodeInterestTypeDef];
