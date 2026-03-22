import { dbPool } from '../../utils/db';

const getPoliticianTypeDef = `#graphql
  extend type Query {
    getPolitician(id: ID!): Politician
  }
`;

export const getPoliticianResolver = async (
  _: unknown,
  { id }: { id: string },
) => {
  const politician = await dbPool.oneOrNone(
    'SELECT * FROM politicians WHERE id = $1',
    [id],
  );
  if (!politician) return null;

  const [recentVotes, recentNews] = await Promise.all([
    dbPool.any('SELECT * FROM politician_votes WHERE politician_id = $1', [id]),
    dbPool.any('SELECT * FROM politician_news WHERE politician_id = $1', [id]),
  ]);

  return { ...politician, recentVotes, recentNews };
};

export const typeDefs = [getPoliticianTypeDef];
