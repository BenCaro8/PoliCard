import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Feature, GeoJsonProperties, MultiPolygon, Polygon } from 'geojson';
import { Area, OverpassPlace, Tags } from '@/__generated__/graphql';
import { LatLng } from 'react-native-maps';
import * as turf from '@turf/turf';

export type ScoredOverpassPlace = OverpassPlace & { score: number };

type MapData = { [id: string]: ScoredOverpassPlace };

const tagWeights: { [x in keyof Tags]: number } = {
  historic: 6,
  tourism: 5,
  cultural: 5,
  leisure: 5,
  wikipedia: 4,
  amenity: 3,
  wikidata: 2,
  office: -3,
  financial: -5,
};

const getPlaceScore = (place: OverpassPlace): number => {
  if (!place.tags) return 0;
  let score = 0;

  for (const tag of Object.keys(place.tags)) {
    if (place.tags[tag as keyof typeof place.tags])
      score += tagWeights[tag as keyof typeof tagWeights] || 0;
  }

  return score;
};

const POI_RANK_THRESHOLD = 5;

export type State = {
  area?: Area;
  queriedZone?: Feature<Polygon | MultiPolygon, GeoJsonProperties>;
  placesMap: MapData;
};

const initialState: State = {
  placesMap: {},
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setArea: (state, action: PayloadAction<Area>) => {
      state.area = action.payload;

      return state;
    },
    addQueriedZone: (
      state,
      action: PayloadAction<{ center: LatLng; radius: number }>,
    ) => {
      const newCircle = turf.circle(
        [action.payload.center.longitude, action.payload.center.latitude],
        action.payload.radius,
        { units: 'feet' },
      );

      state.queriedZone =
        (state.queriedZone
          ? turf.union(turf.featureCollection([state.queriedZone, newCircle]))
          : newCircle) || undefined;

      return state;
    },
    addPlaces: (state, action: PayloadAction<OverpassPlace[]>) => {
      for (const place of action.payload) {
        if (!state.placesMap[place.id]) {
          const score = getPlaceScore(place);
          if (score >= POI_RANK_THRESHOLD) {
            state.placesMap[place.id] = { ...place, score };
          }
        }
      }

      return state;
    },
    clearMapData: (state) => {
      state = initialState;
      return state;
    },
  },
});

export const { setArea, addQueriedZone, addPlaces, clearMapData } =
  mapSlice.actions;
export default mapSlice.reducer;
