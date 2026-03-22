import { z } from 'zod';
import { searchAndExtract } from '../providers/llm';

type JobConfig<T> = {
  /** Returns a search prompt for the given entity name */
  buildSearchPrompt: (name: string) => string;
  schema: z.ZodSchema<T>;
  /** Called after successful extraction and validation */
  persist: (data: T, name: string) => Promise<void>;
};

export async function runIngestionJob<T>(
  config: JobConfig<T>,
  entityName: string,
): Promise<T> {
  console.log(`[ingestion] Starting job for: ${entityName}`);

  const extracted = await searchAndExtract({
    entityName,
    searchPrompt: config.buildSearchPrompt(entityName),
    schema: config.schema,
  });

  await config.persist(extracted, entityName);

  console.log(`[ingestion] Completed job for: ${entityName}`);

  return extracted;
}
