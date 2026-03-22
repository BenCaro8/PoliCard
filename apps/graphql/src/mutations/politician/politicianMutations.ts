import { runPoliticianJob } from '../../ingestion/pipelines/politicianPipeline';

const runPoliticianIngestionTypeDef = `#graphql
  extend type Mutation {
    runPoliticianIngestion(name: String!): Politician
  }
`;

export const runPoliticianIngestionResolver = async (
  _: unknown,
  { name }: { name: string },
) => {
  return runPoliticianJob(name);
};

export const typeDefs = [runPoliticianIngestionTypeDef];
