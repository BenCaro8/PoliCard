import { runIngestionJob } from '../jobs/runIngestionJob';
import { PoliticianSchema, type PoliticianRecord } from '../schemas/politician';
import { dbPool } from '../../utils/db';

function nameToId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export async function runPoliticianJob(
  name: string,
): Promise<PoliticianRecord> {
  const id = nameToId(name);
  const updatedAt = new Date().toISOString();

  const extracted = await runIngestionJob(
    {
      buildSearchPrompt: (name) =>
        `Research the following about US politician ${name}:
1. Recent voting record on bills (last 12 months) — include bill names, dates, and vote positions (Yea/Nay/Absent)
2. Ideology score or rating (DW-NOMINATE, ACU, ADA, or any credible source)
3. Recent news coverage from 2024–2025`,

      schema: PoliticianSchema,

      persist: async (data) => {
        await dbPool.tx(async (t) => {
          await t.none(
            `INSERT INTO politicians (id, name, summary, ideology_score, ideology_source, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO UPDATE SET
               name = EXCLUDED.name,
               summary = EXCLUDED.summary,
               ideology_score = EXCLUDED.ideology_score,
               ideology_source = EXCLUDED.ideology_source,
               updated_at = EXCLUDED.updated_at`,
            [
              id,
              data.name,
              data.summary,
              data.ideologyScore,
              data.ideologySource,
              updatedAt,
            ],
          );

          await t.none(
            'DELETE FROM politician_votes WHERE politician_id = $1',
            [id],
          );

          if (data.recentVotes.length > 0) {
            const votesInsert = data.recentVotes.map((v) => ({
              politician_id: id,
              bill: v.bill,
              date: v.date,
              position: v.position,
              summary: v.summary,
            }));
            await t.none(
              `INSERT INTO politician_votes (politician_id, bill, date, position, summary)
               SELECT politician_id, bill, date, position::vote_position, summary
               FROM json_populate_recordset(null::politician_votes, $1)`,
              [JSON.stringify(votesInsert)],
            );
          }

          await t.none('DELETE FROM politician_news WHERE politician_id = $1', [
            id,
          ]);

          if (data.recentNews.length > 0) {
            const newsInsert = data.recentNews.map((n) => ({
              politician_id: id,
              title: n.title,
              source: n.source,
              url: n.url,
              published_at: n.publishedAt,
              summary: n.summary,
            }));
            await t.none(
              `INSERT INTO politician_news (politician_id, title, source, url, published_at, summary)
               SELECT politician_id, title, source, url, published_at, summary
               FROM json_populate_recordset(null::politician_news, $1)`,
              [JSON.stringify(newsInsert)],
            );
          }
        });

        console.log(`[persist] Upserted "${name}" to DB`);
      },
    },
    name,
  );

  return { ...extracted, id, updatedAt };
}
