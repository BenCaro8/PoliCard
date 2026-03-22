import OpenAI from 'openai';
import { z } from 'zod';

import 'dotenv/config';

let _client: OpenAI | null = null;

const getClient = () => {
  if (!_client) _client = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });
  return _client;
};

type SearchAndExtractInput<T> = {
  entityName: string;
  searchPrompt: string;
  schema: z.ZodSchema<T>;
};

export const searchAndExtract = async <T>({
  entityName,
  searchPrompt,
  schema,
}: SearchAndExtractInput<T>): Promise<T> => {
  const client = getClient();

  // Step 1: Use OpenAI web search to gather current information
  const searchResponse = await client.responses.create({
    model: 'gpt-4o',
    tools: [{ type: 'web_search' }],
    input: searchPrompt,
  });

  const researchContent = searchResponse.output_text;

  // Step 2: Extract structured data from the research
  const jsonSchema = z.toJSONSchema(schema);

  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'extraction',
        strict: true,
        schema: jsonSchema,
      },
    },
    messages: [
      {
        role: 'system',
        content:
          'You are a structured data extraction system for US politician information. Extract data from the provided research. Use null for nullable fields and empty arrays when information is unavailable.',
      },
      {
        role: 'user',
        content: `Extract structured information about ${entityName} from this research:\n\n${researchContent}`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from LLM');

  return schema.parse(JSON.parse(content));
};
