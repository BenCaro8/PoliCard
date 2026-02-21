import { NodeResolvers } from '#gql-types';
import { GraphQLError } from 'graphql';
import { dbPool } from '../../utils/aws';

const PaginatedNodesType = `#graphql
  type PaginatedNodes {
    nodes: [Node!]!
    hasMore: Boolean!
  }
`;

const NodeTextType = `#graphql
  type NodeText {
    nodeTextId: String!
    nodeId: String!
    languageCode: String!
    text: String!
    followOn: [String!]!
  }
`;

const NodeRatingType = `#graphql
  type NodeRating {
    numRatings: Int!
    avgRating: Float!
    myRating: Int
  }
`;

const NodeType = `#graphql
  type Node {
    nodeId: String!
    title: String!
    type: String!
    location: String
    primaryImageUrl: String
    text: String!
    audioUrl: String!
    sources: [String!]!
    followOn: [String!]!
    rating: NodeRating!
    generatedAt: String!
    createdAt: String!
    updatedAt: String!
  }
`;

export const NodeResolver: NodeResolvers = {
  primaryImageUrl: async (parent) => {
    try {
      const { nodeId } = parent;
      const result = await dbPool.oneOrNone(
        `
        SELECT ni.image_url
        FROM node_images ni
        LEFT JOIN votes v ON ni.image_id::text = v.target_id AND v.target_type = 'image' AND v.vote = 1
        WHERE ni.node_id = $1
        GROUP BY ni.image_id
        ORDER BY COUNT(v.vote_id) DESC
        LIMIT 1;
        `,
        [nodeId],
      );

      if (result) {
        return result.imageUrl;
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error at field level primaryImageUrl resolver: ', err);
      throw new GraphQLError('Error fetching node primaryImageUrl');
    }
  },
  rating: async (parent, _, context) => {
    const userId = context.res.locals.userInfo.id;

    try {
      const { nodeId } = parent;
      const ratingStatsRes = await dbPool.oneOrNone(
        `
        SELECT 
          ROUND(AVG(rating), 1) AS avg_rating,
          COUNT(*) AS num_ratings,
          (SELECT rating FROM node_interest_ratings WHERE user_id = $2 AND node_id = $1) AS my_rating
        FROM node_interest_ratings
        WHERE node_id = $1;
        `,
        [nodeId, userId],
      );

      return {
        avgRating: ratingStatsRes.avgRating || 0,
        numRatings: ratingStatsRes.numRatings,
        myRating: ratingStatsRes.myRating ?? null,
      };
    } catch (err) {
      console.error('Error at field level interestRating resolver: ', err);
      throw new GraphQLError('Error fetching node interestRating');
    }
  },
};

const NodeImageType = `#graphql
  type NodeImage {
    imageId: String!
    nodeId: String!
    imageUrl: String!
    uploadedBy: String
    uploadedAt: String!
  }
`;

const NodeAudioType = `#graphql
  type NodeAudio {
    audioId: String!
    nodeId: String!
    language: String!
    audioParagraph1Url: String!
    audioParagraph2Url: String
    uploadedAt: String!
  }
`;

const NodeRelationshipType = `#graphql
  type NodeRelationship {
    relationshipId: String!
    nodeA: String!
    nodeB: String!
    relationshipType: String!
    createdAt: String!
  }
`;

const NodeCommentType = `#graphql
  type NodeComment {
    commentId: String!
    nodeId: String!
    userId: String!
    text: String!
    parentCommentId: String
    createdAt: String!
  }
`;

const VoteType = `#graphql
  type Vote {
    voteId: String!
    userId: String!
    targetId: String!
    targetType: String!
    vote: Int!
    createdAt: String!
  }
`;

const ReportType = `#graphql
  type Report {
    reportId: String!
    userId: String!
    targetId: String!
    targetType: String!
    reason: String!
    createdAt: String!
  }
`;

export default [
  PaginatedNodesType,
  NodeTextType,
  NodeRatingType,
  NodeType,
  NodeImageType,
  NodeAudioType,
  NodeRelationshipType,
  NodeCommentType,
  VoteType,
  ReportType,
];
