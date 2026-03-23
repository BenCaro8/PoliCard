import { runIngestionJob } from '../jobs/runIngestionJob';
import { PoliticianSchema, type PoliticianRecord } from '../schemas/politician';
import { prisma } from '../../utils/prisma';

function nameToId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export async function runPoliticianJob(
  name: string,
): Promise<PoliticianRecord> {
  const id = nameToId(name);
  const updatedAt = new Date();

  const extracted = await runIngestionJob(
    {
      buildSearchPrompt: (name) =>
        `Research the following about US politician ${name}:
1. Recent voting record on bills (last 12 months) — include bill names, dates, and vote positions (Yea/Nay/Absent)
2. Ideology score or rating (DW-NOMINATE, ACU, ADA, or any credible source)
3. Recent news coverage from 2024–2025`,

      schema: PoliticianSchema,

      persist: async (data) => {
        await prisma.$transaction(async (tx) => {
          await tx.politician.upsert({
            where: { id },
            update: {
              name: data.name,
              summary: data.summary,
              ideologyScore: data.ideologyScore,
              ideologySource: data.ideologySource,
              updatedAt,
            },
            create: {
              id,
              name: data.name,
              summary: data.summary,
              ideologyScore: data.ideologyScore,
              ideologySource: data.ideologySource,
              updatedAt,
            },
          });

          await tx.politicianVote.deleteMany({ where: { politicianId: id } });
          if (data.recentVotes.length > 0) {
            await tx.politicianVote.createMany({
              data: data.recentVotes.map((v) => ({
                politicianId: id,
                bill: v.bill,
                date: v.date,
                position: v.position,
                summary: v.summary,
              })),
            });
          }

          await tx.politicianNews.deleteMany({ where: { politicianId: id } });
          if (data.recentNews.length > 0) {
            await tx.politicianNews.createMany({
              data: data.recentNews.map((n) => ({
                politicianId: id,
                title: n.title,
                source: n.source,
                url: n.url,
                publishedAt: n.publishedAt,
                summary: n.summary,
              })),
            });
          }
        });

        console.log(`[persist] Upserted "${name}" to DB`);
      },
    },
    name,
  );

  return { ...extracted, id, updatedAt: updatedAt.toISOString() };
}
