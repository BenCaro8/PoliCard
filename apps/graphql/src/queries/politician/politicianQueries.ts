import { prisma } from '../../utils/prisma';

const getPoliticianTypeDef = `#graphql
  extend type Query {
    getPolitician(id: ID!): Politician
  }
`;

export const getPoliticianResolver = async (
  _: unknown,
  { id }: { id: string },
) => {
  const politician = await prisma.politician.findUnique({
    where: { id },
    include: { votes: true, news: true },
  });
  if (!politician) return null;

  return {
    ...politician,
    recentVotes: politician.votes,
    recentNews: politician.news,
  };
};

export const typeDefs = [getPoliticianTypeDef];
