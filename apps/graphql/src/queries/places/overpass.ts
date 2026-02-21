import { QueryResolvers, Resolvers } from '#gql-types';
import axios from 'axios';

export const OverpassPlaceType = `#graphql
  union OverpassPlace = OverpassNode | OverpassWay
`;

export const NearbyPlacesResultType = `#graphql
  type NearbyPlacesResult {
      area: Area
      places: [OverpassPlace]
    }
`;

const getNearbyPlacesTypeDef = `#graphql
  extend type Query {
    getNearbyPlaces(latitude: Float!, longitude: Float!, distance: Float): NearbyPlacesResult @auth
  }
`;

export const overpassPlaceResolver: Resolvers = {
  OverpassPlace: {
    __resolveType(obj) {
      if ('type' in obj && obj.type === 'way') {
        return 'OverpassWay';
      }

      return 'OverpassNode';
    },
  },
};

export const getNearbyPlacesResolver: QueryResolvers['getNearbyPlaces'] =
  async (_, { latitude, longitude, distance: distanceArg }) => {
    const distance = (distanceArg || 300) * 0.3048; // ft -> meters

    const overpassInstance = axios.create({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });

    const queryStr = `
[out:json][timeout:25];
(
  // Historic sites
  node["historic"]["name"](around:${distance}, ${latitude}, ${longitude});
  way["historic"]["name"](around:${distance}, ${latitude}, ${longitude});

  // Museums
  node["amenity"="museum"]["name"](around:${distance}, ${latitude}, ${longitude});
  way["amenity"="museum"]["name"](around:${distance}, ${latitude}, ${longitude});

  // Tourist attractions
  node["tourism"="attraction"]["name"](around:${distance}, ${latitude}, ${longitude});
  way["tourism"="attraction"]["name"](around:${distance}, ${latitude}, ${longitude});

  // Heritage listings
  node["heritage"]["name"](around:${distance}, ${latitude}, ${longitude});
  way["heritage"]["name"](around:${distance}, ${latitude}, ${longitude});

  // Named buildings
  node["building"]["name"](around:${distance}, ${latitude}, ${longitude});
  way["building"]["name"](around:${distance}, ${latitude}, ${longitude});

  // Objects linked to Wikidata
  node["wikidata"]["name"](around:${distance}, ${latitude}, ${longitude});
  way["wikidata"]["name"](around:${distance}, ${latitude}, ${longitude});

  // Optional: Public artwork (e.g., sculptures, murals)
  node["tourism"="artwork"]["name"](around:${distance}, ${latitude}, ${longitude});
  way["tourism"="artwork"]["name"](around:${distance}, ${latitude}, ${longitude});

  // Optional: Points of cultural significance
  node["cultural"]["name"](around:${distance}, ${latitude}, ${longitude});
  way["cultural"]["name"](around:${distance}, ${latitude}, ${longitude});

  // Check standing in some places Polygon
  is_in(${latitude},${longitude});
);

out center ids;
out geom;
      `;

    const response = await overpassInstance.post(
      'https://overpass-api.de/api/interpreter',
      queryStr,
    );

    let area;
    const placeResults = [];

    for (const resObj of response.data.elements) {
      if (resObj.type === 'node' && resObj.tags?.name) {
        placeResults.push(resObj);
      } else if (resObj.type === 'way' && resObj.center) {
        for (const geomObj of response.data.elements) {
          if (
            geomObj.type === 'way' &&
            geomObj.geometry &&
            geomObj.id === resObj.id
          ) {
            placeResults.push({ ...geomObj, center: resObj.center });
          }
        }
      } else if (
        resObj.type === 'area' &&
        (resObj.tags?.admin_level === '7' || resObj.tags?.admin_level === '8')
      ) {
        area = resObj;
      }
    }

    return { area, places: placeResults };
  };

export const typeDefs = [
  getNearbyPlacesTypeDef,
  OverpassPlaceType,
  NearbyPlacesResultType,
];
