import { QueryResolvers } from '#gql-types';
import { dbPool } from '../../utils/aws';

const getAllInteractedNodesTypeDef = `#graphql
  extend type Query {
    getAllInteractedNodes: [String]! @auth
  }
`;

export const getAllInteractedNodesResolver: QueryResolvers['getAllInteractedNodes'] =
  async (_, __, context) => {
    const userId = context.res.locals.userInfo.id;

    try {
      const result = await dbPool.query(
        'SELECT node_id FROM user_node_interactions WHERE user_id = $1',
        [userId],
      );

      const nodeIds = result.map((row: { node_id: string }) => row.node_id);
      return nodeIds;
    } catch (error) {
      console.error('Error getting interacted nodes:', error);
      throw new Error('Failed to fetch interacted nodes');
    }
  };

export const typeDefs = [getAllInteractedNodesTypeDef];
