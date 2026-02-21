import { MutationResolvers } from '#gql-types';
import { dbPool, deleteFromS3, uploadToS3 } from '../../utils/aws';
import { v4 as uuidv4 } from 'uuid';

import 'dotenv/config';

const uploadImageTypeDef = `#graphql
  extend type Mutation {
    uploadImage(id: ID!, file: Upload!): String! @auth
  }
`;

export const uploadImageResolver: MutationResolvers['uploadImage'] = async (
  _,
  { id, file },
  context,
) => {
  let resolvedFile;
  try {
    resolvedFile = await file;
  } catch (err) {
    console.log(err);
  }
  const userId = context.res.locals.userInfo.id;

  if (!resolvedFile) {
    throw new Error('File is missing after awaiting.');
  }

  const { createReadStream } = resolvedFile;
  const stream = createReadStream();

  const imageId = uuidv4();

  const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/images/${imageId}.jpg`;

  try {
    await uploadToS3(stream, `images/${imageId}.jpg`);

    const insertQuery = `
      INSERT INTO node_images (image_id, node_id, image_url, uploaded_by)
      VALUES ($1, $2, $3, $4)
      RETURNING image_url;
    `;

    const result = await dbPool.one(insertQuery, [
      imageId,
      id,
      imageUrl,
      userId,
    ]);

    if (!result) {
      throw new Error(`No Node found for node ${id}`);
    }

    console.log(`New image uploaded and recorded in DB: ${result.imageUrl}`);

    return result.imageUrl;
  } catch (err) {
    console.error('Error uploading or inserting image:', err);
    throw new Error('Failed to upload or insert image');
  }
};

const deleteImageTypeDef = `#graphql
  extend type Mutation {
    deleteImage(id: ID!): Boolean! @auth
  }
`;

export const deleteImageResolver: MutationResolvers['deleteImage'] = async (
  _,
  { id },
  context,
) => {
  const userId = context.res.locals.userInfo.id;

  try {
    await deleteFromS3(`images/${id}.jpg`);

    const deleteQuery =
      'DELETE FROM node_images WHERE image_id = $1 AND uploaded_by = $2;';

    await dbPool.none(deleteQuery, [id, userId]);

    return true;
  } catch (err) {
    console.error('Error deleting image:', err);
    throw new Error('Failed to delete image');
  }
};

export const typeDefs = [uploadImageTypeDef, deleteImageTypeDef];
