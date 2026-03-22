import { runIngestionJob } from '../jobs/runIngestionJob';
import { PoliticianSchema, type PoliticianRecord } from '../schemas/politician';

function nameToId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export async function runPoliticianJob(
  name: string,
): Promise<PoliticianRecord> {
  const extracted = await runIngestionJob(
    {
      buildSearchPrompt: (name) =>
        `Research the following about US politician ${name}:
1. Recent voting record on bills (last 12 months) — include bill names, dates, and vote positions (Yea/Nay/Absent)
2. Ideology score or rating (DW-NOMINATE, ACU, ADA, or any credible source)
3. Recent news coverage from 2024–2025`,

      schema: PoliticianSchema,

      persist: async (data, name) => {
        // TODO: upsert into politicians table once DB schema is set up
        console.log(`[persist] TODO: upsert "${name}" to DB`);
        console.log(JSON.stringify(data, null, 2));
      },
    },
    name,
  );

  return {
    ...extracted,
    id: nameToId(name),
    updatedAt: new Date().toISOString(),
  };
}
