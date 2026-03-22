const getPoliticianTypeDef = `#graphql
  extend type Query {
    getPolitician(id: ID!): Politician
  }
`;

export const getPoliticianResolver = async (
  _: unknown,
  { id }: { id: string },
) => {
  // TODO: query from DB once politicians table is set up
  console.log(`[getPolitician] id=${id}`);
  return null;
};

export const typeDefs = [getPoliticianTypeDef];
