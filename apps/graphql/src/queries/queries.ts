import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import {
  typeDefs as userQueryTypeDefs,
  isUserLoggedInResolver,
  getUserResolver,
} from './user/userQueries';
import {
  typeDefs as nodeQueryTypeDefs,
  getPopularNodesResolver,
  getNewestNodesResolver,
  getNodeResolver,
} from './nodes/nodeQueries';
import {
  typeDefs as sessionQueryTypeDefs,
  getUserSessionsResolver,
  getUserNonReplayNodesResolver,
  getUserSessionNodesResolver,
} from './session/sessionQueries';
import {
  typeDefs as audioTypeDefs,
  streamAudioResolver,
} from './media/audioQueries';
import {
  typeDefs as getNearbyPlacesTypeDefs,
  getNearbyPlacesResolver,
  overpassPlaceResolver,
} from './places/overpass';
import {
  typeDefs as interactionTypeDefs,
  getAllInteractedNodesResolver,
} from './interactions/interactionQueries';
import {
  typeDefs as imageTypeDefs,
  getImagesResolver,
} from './media/imageQueries';

const baseQueryTypeDef = `#graphql
  type Query { 
    _empty: String
  }
`;

const baseQueryResolver = {
  ...overpassPlaceResolver,

  Query: {
    isUserLoggedIn: isUserLoggedInResolver,
    getUser: getUserResolver,
    streamAudio: streamAudioResolver,
    getNearbyPlaces: getNearbyPlacesResolver,
    getAllInteractedNodes: getAllInteractedNodesResolver,
    getUserSessions: getUserSessionsResolver,
    getUserSessionNodes: getUserSessionNodesResolver,
    getPopularNodes: getPopularNodesResolver,
    getNewestNodes: getNewestNodesResolver,
    getNode: getNodeResolver,
    getUserNonReplayNodes: getUserNonReplayNodesResolver,
    getImages: getImagesResolver,
  },
};

const typeDefsArray = [
  ...userQueryTypeDefs,
  ...sessionQueryTypeDefs,
  ...nodeQueryTypeDefs,
  ...audioTypeDefs,
  ...getNearbyPlacesTypeDefs,
  ...interactionTypeDefs,
  ...imageTypeDefs,
  baseQueryTypeDef,
];
const resolversArray = [baseQueryResolver];

export const typeDefs = mergeTypeDefs(typeDefsArray);
export const resolvers = mergeResolvers(resolversArray);
