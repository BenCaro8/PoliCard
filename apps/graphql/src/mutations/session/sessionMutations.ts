import { MutationResolvers } from '#gql-types';
import { dbPool } from '../../utils/aws';

const startSessionTypeDef = `#graphql
  extend type Mutation {
    startSession: Session! @auth
  }
`;

export const startSessionResolver: MutationResolvers['startSession'] = async (
  _,
  __,
  context,
) => {
  const userId = context.res.locals.userInfo.id;
  let result;
  try {
    result = await dbPool.one(
      'INSERT INTO sessions (user_id) VALUES ($1) RETURNING *',
      [userId],
    );
  } catch (error) {
    console.error('Error in startSession resolver: ', error);
    return false;
  }

  return result;
};

const updateSessionTitleTypeDef = `#graphql
  extend type Mutation {
    updateSessionTitle(sessionId: String!, title: String): Boolean @auth
  }
`;

export const updateSessionTitleResolver: MutationResolvers['updateSessionTitle'] =
  async (_, { sessionId, title }, context) => {
    const userId = context.res.locals.userInfo.id;
    try {
      await dbPool.oneOrNone(
        `UPDATE sessions 
         SET title = $2 
         WHERE session_id = $1 AND user_id = $3
         RETURNING *;`,
        [sessionId, title, userId],
      );
    } catch (error) {
      console.error('Error in updateSessionTitle resolver: ', error);
      return false;
    }

    return true;
  };

const endSessionTypeDef = `#graphql
  extend type Mutation {
    endSession(sessionId: String!): Boolean @auth
  }
`;

export const endSessionResolver: MutationResolvers['endSession'] = async (
  _,
  { sessionId },
) => {
  try {
    await dbPool.none(
      'UPDATE sessions SET end_time = CURRENT_TIMESTAMP WHERE session_id = $1',
      [sessionId],
    );
    return true;
  } catch (error) {
    console.error('Error in endSession resolver: ', error);
    return false;
  }
};

const addSessionNodeTypeDef = `#graphql
 extend type Mutation {
  addSessionNode(sessionId: String!, nodeId: String!): Boolean @auth
 }
`;

export const addSessionNodeResolver: MutationResolvers['addSessionNode'] =
  async (_, { sessionId, nodeId }) => {
    try {
      await dbPool.none(
        'INSERT INTO session_nodes (session_id, node_id) VALUES ($1, $2)',
        [sessionId, nodeId],
      );
      return true;
    } catch (error) {
      console.error('Error in addSessionNode resolver: ', error);
      return false;
    }
  };

const deleteSessionsTypeDef = `#graphql
  extend type Mutation {
    deleteSessions(ids: [String!]!): Boolean @auth
  }
`;

export const deleteSessionsResolver: MutationResolvers['deleteSessions'] =
  async (_, { ids }, context) => {
    const userId = context.res.locals.userInfo.id;

    try {
      await dbPool.none(
        `
        DELETE FROM sessions
        WHERE session_id::text IN (SELECT unnest($1::text[]))
        AND user_id = $2;

        DELETE FROM session_nodes
        WHERE session_id::text IN (SELECT unnest($1::text[])); 
        `,
        [ids, userId],
      );
      return true;
    } catch (error) {
      console.error('Error in deleteSessions resolver: ', error);
      return false;
    }
  };

export const typeDefs = [
  startSessionTypeDef,
  updateSessionTitleTypeDef,
  endSessionTypeDef,
  addSessionNodeTypeDef,
  deleteSessionsTypeDef,
];
