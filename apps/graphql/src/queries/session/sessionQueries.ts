import { QueryResolvers } from '#gql-types';
import { GraphQLError } from 'graphql';
import { dbPool } from '../../utils/aws';
import { isTruthy } from '../../utils/filter';

const getUserSessionsTypeDef = `#graphql
  type PaginatedSessions {
    sessions: [Session!]!
    hasMore: Boolean!
  }

  extend type Query {
    getUserSessions(page: Int!, pageSize: Int!): PaginatedSessions! @auth
  }
`;

export const getUserSessionsResolver: QueryResolvers['getUserSessions'] =
  async (_, { page, pageSize }, context) => {
    const userId = context.res.locals.userInfo.id;
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    try {
      const result = await dbPool.manyOrNone(
        `SELECT s.*,
            json_agg(sn.node_id) AS nodes
         FROM sessions s
         LEFT JOIN session_nodes sn ON s.session_id = sn.session_id
         WHERE s.user_id = $1 AND s.end_time IS NOT NULL
         GROUP BY s.session_id
         ORDER BY s.start_time DESC
         LIMIT $2 OFFSET $3;`,
        [userId, limit + 1, offset],
      );

      let hasMore = false;
      if (result.length > limit) {
        hasMore = true;
        result.pop();
      }

      const formattedSessions = result.map((session) => {
        return {
          ...session,
          nodes: !session.nodes.filter(isTruthy).length ? [] : session.nodes,
        };
      });

      return {
        sessions: formattedSessions,
        hasMore,
      };
    } catch (error) {
      console.error('Error getting interacted nodes:', error);
      throw new Error('Failed to fetch interacted nodes');
    }
  };

const getUserSessionNodesTypeDef = `#graphql
  extend type Query {
    getUserSessionNodes(sessionId: String!, page: Int!, pageSize: Int!, languageCode: String): PaginatedNodes! @auth
  }
`;

export const getUserSessionNodesResolver: QueryResolvers['getUserSessionNodes'] =
  async (
    _,
    { sessionId, page, pageSize, languageCode: languageCodeArg },
    context,
  ) => {
    const userId = context.res.locals.userInfo.id;
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const languageCode = languageCodeArg || 'en';

    try {
      const sessionCheckResult = await dbPool.oneOrNone(
        'SELECT user_id FROM sessions WHERE session_id::text = $1',
        [sessionId],
      );

      if (!sessionCheckResult) {
        throw new GraphQLError('Session not found', {
          extensions: {
            code: 'NOT_FOUND',
            http: { status: 404 },
          },
        });
      }

      if (sessionCheckResult.userId !== userId) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: 'UNAUTHORIZED',
            http: { status: 403 },
          },
        });
      }

      const result = await dbPool.manyOrNone(
        `
        SELECT
            n.*,
            sn.visited_at,
            nt.text,
            nt.follow_on,
            na.audio_url
        FROM nodes n
        INNER JOIN
            session_nodes sn ON n.node_id = sn.node_id
        LEFT JOIN
            node_text nt ON n.node_id = nt.node_id AND nt.language_code = $2
        LEFT JOIN
            node_audio na ON n.node_id = na.node_id AND na.language_code = $2
        WHERE
            sn.session_id = $1
        ORDER BY
            sn.visited_at ASC
        LIMIT $3 OFFSET $4;
        `,
        [sessionId, languageCode, limit + 1, offset],
      );

      let hasMore = false;
      if (result.length > limit) {
        hasMore = true;
        result.pop();
      }

      return { nodes: result, hasMore };
    } catch (error) {
      console.error('Error getting session nodes:', error);
      throw new Error('Failed to fetch session nodes');
    }
  };

const getUserNonReplayNodesDef = `#graphql
  extend type Query {
    getUserNonReplayNodes: [String!]! @auth
  }
`;

export const getUserNonReplayNodesResolver: QueryResolvers['getUserNonReplayNodes'] =
  async (_, __, context) => {
    const userId = context.res.locals.userInfo.id;

    try {
      const result = await dbPool.manyOrNone(
        `SELECT node_id
         FROM user_node_interactions
         WHERE user_id = $1 AND replay_enabled = FALSE;`,
        [userId],
      );

      return result.map((row) => row.nodeId);
    } catch (error) {
      console.error('Error getting interacted nodes:', error);
      throw new Error('Failed to fetch interacted nodes');
    }
  };

export const typeDefs = [
  getUserSessionsTypeDef,
  getUserSessionNodesTypeDef,
  getUserNonReplayNodesDef,
];
