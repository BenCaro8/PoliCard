import { QueryResolvers } from '#gql-types';
import { createReadStream } from 'fs';

const streamAudioTypeDef = `#graphql
  extend type Query {
    streamAudio(fileId: ID!): String! @auth
  }
`;

export const streamAudioResolver: QueryResolvers['streamAudio'] = async (
  _,
  { fileId },
) => {
  const filePath = `./storage/${fileId}`;
  const stream = createReadStream(filePath);

  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk.toString('base64'));
  }

  return chunks.join('');
};

export const typeDefs = [streamAudioTypeDef];
