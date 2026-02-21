import { QueryResolvers } from '#gql-types';
import { dbPool } from '../../utils/aws';

const getImagesTypeDef = `#graphql
  extend type Query {
    getImages(nodeId: String!, limit: Int, offset: Int): [NodeImage!]! @auth
  }
`;

export const getImagesResolver: QueryResolvers['getImages'] = async (
  _,
  { nodeId, limit = 10, offset = 0 },
) => {
  try {
    const query = `
      SELECT node_id, image_id, image_url, uploaded_by, uploaded_at
      FROM node_images
      WHERE node_id = $1
      ORDER BY uploaded_at DESC
      LIMIT $2 OFFSET $3;
    `;

    const images = await dbPool.manyOrNone(query, [nodeId, limit, offset]);

    return images;
  } catch (err) {
    console.error('Error fetching images:', err);
    throw new Error('Failed to retrieve images');
  }
};

export const typeDefs = [getImagesTypeDef];
