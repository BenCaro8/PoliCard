import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/store';
import { processPlaceNodes } from '../utils/slices/session';
import useLocationTracking from './useLocationTracking';
import useNearbyLocations from './useNearbyLocations';
import * as turf from '@turf/turf';

type Args = {
  searchRadius?: number;
  queryTriggerRadius?: number;
  nodeRadius?: number;
};

const usePOISubscription = ({
  searchRadius = 300,
  queryTriggerRadius = 200,
  nodeRadius = 100,
}: Args = {}) => {
  const dispatch = useAppDispatch();
  const { placesMap } = useAppSelector((state) => state.map);
  const { location, heading, error } = useLocationTracking();
  const getNearbyLocations = useNearbyLocations(queryTriggerRadius);

  // Have to use ref, execution context was otherwise bound to an older version of the function
  const placesMapRef = useRef(placesMap);

  useEffect(() => {
    placesMapRef.current = placesMap;
  }, [placesMap]);

  useEffect(() => {
    if (location) {
      getNearbyLocations(location, searchRadius);
    }
  }, [getNearbyLocations, location, searchRadius]);

  const getPOINarration = useCallback(() => {
    if (!location) return;
    const nearbyPOIs: { id: string; distance: number }[] = [];

    Object.values(placesMapRef.current).forEach((place) => {
      let distance = Infinity;

      if (place.__typename === 'OverpassWay' && place.geometry) {
        const polygonCoordinates = place.geometry.map((coord) => [
          coord.lon,
          coord.lat,
        ]);
        const userPoint = turf.point([location.longitude, location.latitude]);
        const line = turf.lineString(polygonCoordinates);
        const nearestPoint = turf.nearestPointOnLine(line, userPoint);
        distance = turf.distance(userPoint, nearestPoint, { units: 'feet' });
      } else if (
        place.__typename === 'OverpassNode' &&
        place.lat &&
        place.lon
      ) {
        distance = turf.distance(
          turf.point([location.longitude, location.latitude]),
          turf.point([place.lon, place.lat]),
          { units: 'feet' },
        );
      }

      if (distance <= nodeRadius && place.tags?.name) {
        nearbyPOIs.push({ id: place.id, distance });
      }
    });

    nearbyPOIs.sort((a, b) => a.distance - b.distance);

    const ids = nearbyPOIs.map((nearbyPOI) => nearbyPOI.id);

    dispatch(processPlaceNodes(ids));
  }, [dispatch, nodeRadius, location]);

  useEffect(() => {
    getPOINarration();
  }, [getPOINarration, placesMap]);

  return { location, heading, error };
};

export default usePOISubscription;
