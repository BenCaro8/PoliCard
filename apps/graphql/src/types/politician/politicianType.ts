export const PoliticianVoteType = `#graphql
  enum VotePosition {
    Yea
    Nay
    Absent
  }

  type PoliticianVote {
    bill: String!
    date: String!
    position: VotePosition!
    summary: String!
  }
`;

export const PoliticianNewsItemType = `#graphql
  type PoliticianNewsItem {
    title: String!
    source: String!
    url: String!
    publishedAt: String!
    summary: String!
  }
`;

export const PoliticianType = `#graphql
  type Politician {
    id: ID!
    name: String!
    summary: String!
    ideologyScore: Float
    ideologySource: String
    recentVotes: [PoliticianVote!]!
    recentNews: [PoliticianNewsItem!]!
    updatedAt: String!
  }
`;
