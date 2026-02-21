import { QueryResolvers } from '#gql-types';
import { dbPool } from '../../utils/aws';

const getPopularNodesTypeDef = `#graphql
  extend type Query {
    getPopularNodes(page: Int!, pageSize: Int!, languageCode: String): PaginatedNodes
  }
`;

export const getPopularNodesResolver: QueryResolvers['getPopularNodes'] =
  async (_, { page, pageSize, languageCode: languageCodeArg }) => {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const languageCode = languageCodeArg || 'en';

    console.log(languageCode);

    try {
      const result = await dbPool.manyOrNone(
        `
      SELECT
          n.*,
          SUM(v.vote) AS vote_score
      FROM
          nodes n
      JOIN
          votes v ON n.node_id = v.target_id
      WHERE
          v.target_type = 'node'
          AND v.created_at >= NOW() - INTERVAL '3 days'
      GROUP BY
          n.node_id, n.title, n.primary_image_url
      ORDER BY
          vote_score DESC,
          n.created_at DESC
      LIMIT $1 OFFSET $2;
    `,
        [offset, pageSize],
      );

      let hasMore = false;
      if (result.length > limit) {
        hasMore = true;
        result.pop();
      }

      return {
        nodes: [],
        hasMore,
      };
    } catch (error) {
      console.error('Error getting interacted nodes:', error);
      throw new Error('Failed to fetch interacted nodes');
    }
  };

const getNewestNodesTypeDef = `#graphql
  extend type Query {
    getNewestNodes(page: Int!, pageSize: Int!, languageCode: String): PaginatedNodes
  }
`;

export const getNewestNodesResolver: QueryResolvers['getNewestNodes'] = async (
  _,
  { page, pageSize, languageCode: languageCodeArg },
) => {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  const languageCode = languageCodeArg || 'en';

  try {
    const result = await dbPool.manyOrNone(
      `
      SELECT
          n.*,
          nt.text,
          nt.follow_on,
          na.audio_url
      FROM
          nodes n
      LEFT JOIN
          node_text nt ON n.node_id = nt.node_id AND nt.language_code = $3
      LEFT JOIN
          node_audio na ON n.node_id = na.node_id AND na.language_code = $3
      ORDER BY
          n.created_at DESC
      LIMIT $2 OFFSET $1;
    `,
      [offset, pageSize, languageCode],
    );

    let hasMore = false;
    if (result.length > limit) {
      hasMore = true;
      result.pop();
    }

    return {
      nodes: result,
      hasMore,
    };
  } catch (error) {
    console.error('Error getting interacted nodes:', error);
    throw new Error('Failed to fetch interacted nodes');
  }
};

const getNodeTypeDef = `#graphql
  extend type Query {
    getNode(nodeId: String!, languageCode: String): Node!
  }
`;

export const getNodeResolver: QueryResolvers['getNode'] = async (
  _,
  { nodeId, languageCode: languageCodeArg },
) => {
  const languageCode = languageCodeArg || 'en';

  try {
    const result = await dbPool.oneOrNone(
      `
      SELECT n.*, nt.text, na.audio_url, nt.follow_on
      FROM nodes n
      JOIN node_text nt ON n.node_id = nt.node_id
      JOIN node_audio na ON n.node_id = na.node_id
      WHERE n.node_id = $1 AND nt.language_code = $2 AND na.language_code = $2;
    `,
      [nodeId, languageCode],
    );

    return result;
  } catch (error) {
    console.error('Error getting node:', error);
    throw new Error('Failed to fetch node');
  }
};

export const typeDefs = [
  getPopularNodesTypeDef,
  getNewestNodesTypeDef,
  getNodeTypeDef,
];
