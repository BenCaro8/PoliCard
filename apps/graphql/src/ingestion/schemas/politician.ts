import { z } from 'zod';

export const PoliticianSchema = z.object({
  name: z.string(),
  summary: z.string(),
  ideologyScore: z.number().nullable(),
  ideologySource: z.string().nullable(),
  recentVotes: z.array(
    z.object({
      bill: z.string(),
      date: z.string(),
      position: z.enum(['Yea', 'Nay', 'Absent']),
      summary: z.string(),
    }),
  ),
  recentNews: z.array(
    z.object({
      title: z.string(),
      source: z.string(),
      url: z.string(),
      publishedAt: z.string(),
      summary: z.string(),
    }),
  ),
});

/** LLM-extracted fields only — no DB-managed fields */
export type PoliticianExtracted = z.infer<typeof PoliticianSchema>;

/** Full record returned after ingestion, including DB-managed fields */
export type PoliticianRecord = PoliticianExtracted & {
  id: string;
  updatedAt: string;
};
