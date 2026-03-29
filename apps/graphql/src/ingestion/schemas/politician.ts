import * as z from 'zod';

import { PoliticianCreateWithoutVotesInputObjectZodSchema } from '../../../__generated__/schemas/objects/PoliticianCreateWithoutVotesInput.schema';
import { PoliticianNewsCreateWithoutPoliticianInputObjectZodSchema } from '../../../__generated__/schemas/objects/PoliticianNewsCreateWithoutPoliticianInput.schema';
import { PoliticianVoteCreateWithoutPoliticianInputObjectZodSchema } from '../../../__generated__/schemas/objects/PoliticianVoteCreateWithoutPoliticianInput.schema';

const VoteSchema =
  PoliticianVoteCreateWithoutPoliticianInputObjectZodSchema.omit({
    voteId: true,
  });
const NewsSchema =
  PoliticianNewsCreateWithoutPoliticianInputObjectZodSchema.omit({
    newsId: true,
  });

export const PoliticianSchema =
  PoliticianCreateWithoutVotesInputObjectZodSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    news: true,
  }).extend({
    recentVotes: z.array(VoteSchema),
    recentNews: z.array(NewsSchema),
  });

/** LLM-extracted fields only — no DB-managed fields */
export type PoliticianExtracted = z.infer<typeof PoliticianSchema>;

/** Full record returned after ingestion, including DB-managed fields */
export type PoliticianRecord = PoliticianExtracted & {
  id: string;
  updatedAt: string;
};
