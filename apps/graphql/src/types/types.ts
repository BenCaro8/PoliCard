import {
  TagsType,
  CoordinatesType,
  OverpassWayType,
  OverpassNodeType,
  AreaType,
} from './places/placeTypes';
import NodeTypes, { NodeResolver } from './node/types';
import { SessionType } from './session/sessionType';
import { UserType, UserMetadataType, UserResolver } from './user/userType';

export const typeDefs = [
  ...NodeTypes,
  SessionType,
  UserType,
  UserMetadataType,
  CoordinatesType,
  TagsType,
  OverpassWayType,
  OverpassNodeType,
  AreaType,
];

export const typeResolvers = {
  User: UserResolver,
  Node: NodeResolver,
};
