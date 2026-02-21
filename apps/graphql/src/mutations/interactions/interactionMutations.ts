import { MutationResolvers } from '#gql-types';
import { dbPool, uploadToS3 } from '../../utils/aws';
import { ElevenLabsClient } from 'elevenlabs';
import { generateGeminiResponse } from '../../utils/gemini';

import 'dotenv/config';

const getPlaceNodeTypeDef = `#graphql
  extend type Mutation {
    getPlaceNode(id: String!, name: String!, area: String!, languageCode: String): Node @auth
  }
`;

const ttsClient = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export const getPlaceNodeResolver: MutationResolvers['getPlaceNode'] = async (
  _,
  { id, name, area, languageCode: languageCodeArg },
) => {
  const message = `${name} in (the) ${area}`;
  const languageCode = languageCodeArg || 'en';
  console.log({ id, message, languageCode });

  try {
    const existingQuery = `
      SELECT n.*, nt.text, na.audio_url, nt.follow_on
      FROM nodes n
      JOIN node_text nt ON n.node_id = nt.node_id
      JOIN node_audio na ON n.node_id = na.node_id
      WHERE n.node_id = $1 AND nt.language_code = $2 AND na.language_code = $2;
    `;
    const existingResult = await dbPool.oneOrNone(existingQuery, [
      id,
      languageCode,
    ]);

    if (existingResult) {
      console.log(
        `Found existing Node for ID ${id} and language ${languageCode}`,
      );
      return existingResult;
    }
  } catch (err) {
    console.error('Error checking for existing Node:', err);
    throw new Error('Database query failed');
  }

  console.log(
    `No existing Node found for ID ${id} and language ${languageCode}. Generating new response.`,
  );

  const audioFileName = `${id}_${languageCode}.mp3`;

  try {
    const nodeID = id;
    const { text, followOn } = await generateGeminiResponse(message);

    const audio = await ttsClient.generate({
      stream: true,
      voice: 'Brian',
      text: text || '',
      model_id: 'eleven_flash_v2_5',
    });

    await uploadToS3(audio, audioFileName);

    await dbPool.tx(async (t) => {
      const insertNodeQuery = `
            INSERT INTO nodes (node_id, title, type)
            VALUES ($1, $2, 'place')
            RETURNING *;
        `;
      const nodeResult = await t.one(insertNodeQuery, [id, name]);

      const insertTextQuery = `
        INSERT INTO node_text (node_id, language_code, text, follow_on)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      await t.one(insertTextQuery, [
        nodeID,
        languageCode,
        text,
        JSON.stringify(followOn),
      ]);

      const insertAudioQuery = `
        INSERT INTO node_audio (node_id, language_code, audio_url)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      await t.one(insertAudioQuery, [
        nodeID,
        languageCode,
        `https://${process.env.S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${audioFileName}`,
      ]);
      return {
        ...nodeResult,
        text,
        audioUrl: `https://${process.env.S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${audioFileName}`,
        followOn,
      };
    });
  } catch (err) {
    console.error('Error generating or uploading audio:', err);
    throw new Error('Failed to generate or upload audio');
  }
};

const markNodeInteractedTypeDef = `#graphql
  extend type Mutation {
    markNodeInteracted(nodeId: String!): Boolean @auth
  }
`;

export const markNodeInteractedResolver: MutationResolvers['markNodeInteracted'] =
  async (_, { nodeId }, context) => {
    const userId = context.res.locals.userInfo.id;

    try {
      await dbPool.none(
        'INSERT INTO user_node_interactions (user_id, node_id) VALUES ($1, $2)',
        [userId, nodeId],
      );
      return true;
    } catch (error) {
      console.error('Error marking node interacted:', error);
      return false;
    }
  };

const enableReplayForUserNodesTypeDef = `#graphql
  extend type Mutation {
    enableReplayForUserNodes: Boolean @auth
  }
`;

export const enableReplayForUserNodesResolver: MutationResolvers['enableReplayForUserNodes'] =
  async (_, __, context) => {
    const userId = context.res.locals.userInfo.id;

    try {
      await dbPool.query(
        'UPDATE user_node_interactions SET replay_enabled = TRUE WHERE user_id = $1',
        [userId],
      );
      return true;
    } catch (error) {
      console.error('Error in enableReplayForUserNodes resolver: ', error);
      throw new Error(`Failed to enable replay for user nodes: ${error}`);
    }
  };

export const typeDefs = [
  getPlaceNodeTypeDef,
  markNodeInteractedTypeDef,
  enableReplayForUserNodesTypeDef,
];
