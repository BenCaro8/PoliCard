export const SessionType = `#graphql
  type Session {
    sessionId: String!
    userId: String!
    title: String
    startTime: String!
    endTime: String
    createdAt: String!
    updatedAt: String!
    nodes: [String!]!
  }
`;
