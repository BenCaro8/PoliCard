import { runPoliticianJob } from '../ingestion/pipelines/politicianPipeline';

const politicians = [
  'Bernie Sanders',
  'Ted Cruz',
  'Susan Collins',
  'John Fetterman',
];

async function main() {
  for (const name of politicians) {
    await runPoliticianJob(name);
  }
}

main().catch(console.error);
