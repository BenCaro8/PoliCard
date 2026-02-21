import { useAppDispatch, useAppSelector } from '../utils/store';
import { addPlaces, addQueriedZone, setArea } from '../utils/slices/map';
import { updateSessionName } from '../utils/slices/session';
import { useLazyQuery } from '@apollo/client';
import { isTruthy } from '../utils/filter';
import { LatLng } from 'react-native-maps';
import * as turf from '@turf/turf';
import { gql } from '@gql';
import { useEffect, useCallback, useRef } from 'react';

const GET_NEARBY_LOCATION = gql(`
  query GetNearbyPlaces($latitude: Float!, $longitude: Float!, $distance: Float!) {
    getNearbyPlaces(latitude: $latitude, longitude: $longitude, distance: $distance) {
        places {
            ... on OverpassNode {
                type
                id
                lat
                lon
                tags {
                    name
                    wikidata
                    wikipedia
                    amenity
                    tourism
                    historic
                    cultural
                    leisure
                    office
                    financial
                    building
                }
            }
            ... on OverpassWay {
                type
                id
                nodes
                center {
                    lat
                    lon
                }
                tags {
                    name
                    wikidata
                    wikipedia
                    amenity
                    tourism
                    historic
                    cultural
                    leisure
                    office
                    financial
                    building
                }
                geometry {
                    lat
                    lon
                }
            }
        }
        area {
            type
            id
            tags {
                name
                border_type
            }
        }
    }
  }
`);

const useNearbyLocations = (queryTriggerRadius: number) => {
  const dispatch = useAppDispatch();
  const { currentSessionId, nonReplayNodes } = useAppSelector(
    (state) => state.session,
  );
  const { area, queriedZone } = useAppSelector((state) => state.map);

  // Have to use ref, execution context was otherwise bound to an older version of the function
  const queriedZoneRef = useRef(queriedZone);

  // Stops duplicate querying of area when `getNearbyLocations` called in rapid succession
  const queryInProgressRef = useRef(false);

  useEffect(() => {
    queriedZoneRef.current = queriedZone;
  }, [queriedZone]);

  const [getNearbyLocationsQuery] = useLazyQuery(GET_NEARBY_LOCATION);

  const getNearbyLocations = useCallback(
    async (location: LatLng, radius: number) => {
      if (
        queryInProgressRef.current ||
        !currentSessionId ||
        !Array.isArray(nonReplayNodes)
      )
        return;

      const isInsideExistingZone = queriedZoneRef.current
        ? turf.booleanPointInPolygon(
            turf.point([location.longitude, location.latitude]),
            queriedZoneRef.current,
          )
        : false;

      if (!isInsideExistingZone) {
        queryInProgressRef.current = true;

        try {
          const res = await getNearbyLocationsQuery({
            variables: { ...location, distance: radius },
          });
          const { data, error } = res;

          if (error) return;

          const newArea = data?.getNearbyPlaces?.area;
          const places = data?.getNearbyPlaces?.places;
          if (newArea && (!area || newArea?.tags?.name !== area?.tags?.name)) {
            dispatch(setArea(newArea));
            if (newArea?.tags?.name)
              dispatch(updateSessionName({ title: newArea.tags.name }));
          }
          if (places) {
            dispatch(addPlaces(places.filter(isTruthy)));
            dispatch(
              addQueriedZone({
                center: location,
                radius: queryTriggerRadius,
              }),
            );
          }
        } finally {
          queryInProgressRef.current = false;
        }
      }
    },
    [
      area,
      currentSessionId,
      dispatch,
      getNearbyLocationsQuery,
      nonReplayNodes,
      queryTriggerRadius,
    ],
  );

  return getNearbyLocations;
};

export default useNearbyLocations;
