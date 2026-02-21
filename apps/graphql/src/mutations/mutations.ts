import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import {
  typeDefs as userMutationTypeDefs,
  signUpUserResolver,
  confirmSignUpResolver,
  resendConfirmationCodeResolver,
  loginUserResolver,
  logoutUserResolver,
} from './user/userMutations';
import {
  typeDefs as interactionMutationTypeDefs,
  getPlaceNodeResolver,
  markNodeInteractedResolver,
  enableReplayForUserNodesResolver,
} from './interactions/interactionMutations';
import {
  typeDefs as nodeMutationTypeDefs,
  rateNodeInterestResolver,
} from './nodes/nodeMutations';
import {
  typeDefs as sessionMutationTypeDefs,
  startSessionResolver,
  endSessionResolver,
  addSessionNodeResolver,
  updateSessionTitleResolver,
  deleteSessionsResolver,
} from './session/sessionMutations';
import {
  deleteImageResolver,
  typeDefs as imageMutationTypeDefs,
  uploadImageResolver,
} from './media/imageMutations';

const baseMutationTypeDef = `#graphql
  scalar Upload

  type Mutation { 
    _empty: String
  }
`;

const baseMutationResolver = {
  Upload: GraphQLUpload,
  Mutation: {
    signUpUser: signUpUserResolver,
    confirmSignUp: confirmSignUpResolver,
    resendConfirmationCode: resendConfirmationCodeResolver,
    loginUser: loginUserResolver,
    logoutUser: logoutUserResolver,
    getPlaceNode: getPlaceNodeResolver,
    markNodeInteracted: markNodeInteractedResolver,
    rateNodeInterest: rateNodeInterestResolver,
    enableReplayForUserNodes: enableReplayForUserNodesResolver,
    startSession: startSessionResolver,
    endSession: endSessionResolver,
    updateSessionTitle: updateSessionTitleResolver,
    addSessionNode: addSessionNodeResolver,
    deleteSessions: deleteSessionsResolver,
    uploadImage: uploadImageResolver,
    deleteImage: deleteImageResolver,
  },
};

const typeDefsArray = [
  ...userMutationTypeDefs,
  ...interactionMutationTypeDefs,
  ...sessionMutationTypeDefs,
  ...imageMutationTypeDefs,
  ...nodeMutationTypeDefs,
  baseMutationTypeDef,
];
const resolversArray = [baseMutationResolver];

export const typeDefs = mergeTypeDefs(typeDefsArray);
export const resolvers = mergeResolvers(resolversArray);
