export const TagsType = `#graphql
  type Tags {
    name: String
    wikidata: String
    wikipedia: String
    amenity: String
    tourism: String
    historic: String
    cultural: String
    leisure: String
    office: String
    financial: String
    building: String
    border_type: String
  }
`;

export const CoordinatesType = `#graphql
  type Coordinates {
    lat: Float!
    lon: Float!
  }
`;

export const OverpassNodeType = `#graphql
 type OverpassNode {
    type: String!
    id: ID!
    lat: Float!
    lon: Float!
    tags: Tags
  }
`;

export const OverpassWayType = `#graphql
 type OverpassWay {
    type: String!
    id: ID!
    center: Coordinates!
    tags: Tags
    nodes: [String!]
    geometry: [Coordinates!]
  }
`;

export const AreaType = `#graphql
 type Area {
    type: String!
    id: ID!
    tags: Tags
  }
`;
