import { FC, useEffect, useRef, useState } from 'react';
import { MultiPolygon, Polygon as SinglePolygon } from 'geojson';
import { useAppSelector } from '../utils/store';
import MapView, {
  LatLng,
  MapPressEvent,
  Marker,
  Polygon,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';
import { PRIMARY_ACCENT_COLOR } from '@/src/utils/shared/common';
import styles, { customMapStyle } from './styles/Map';

type Props = {
  style?: StyleProp<ViewStyle>;
  location?: LatLng;
  heading?: number;
};

const Map: FC<Props> = ({ style, location, heading }) => {
  const { theme } = useAppSelector((state) => state.settings);
  const { placesMap, queriedZone } = useAppSelector((state) => state.map);
  const [initialRegion, setInitialRegion] = useState<Region>();
  const [pinLocation, setPinLocation] = useState<LatLng>();
  const mapViewRef = useRef<MapView>(null);

  useEffect(() => {
    if (!initialRegion && location) {
      setInitialRegion({
        ...location,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [initialRegion, location]);

  useEffect(() => {
    if (mapViewRef.current && location) {
      mapViewRef.current.animateCamera({
        center: location,
        heading: heading || 0,
        pitch: 45,
        zoom: 17,
      });
    }
  }, [location, heading]);

  const handleAnimation = async () => {
    // Wait 10ms otherwise we sometimes lose animation
    await new Promise((_) => setTimeout(_, 10));
    if (mapViewRef.current && initialRegion) {
      mapViewRef.current.animateCamera(
        { zoom: 17, pitch: 85 },
        { duration: 1500 },
      );
    }
  };

  const handleMapPress = (event: MapPressEvent) => {
    const coordinate = event.nativeEvent.coordinate;
    setPinLocation(coordinate);
    // getNearbyLocations(coordinate, 300.0);
  };

  const renderPolygonCoordinates = (
    geometry?: SinglePolygon | MultiPolygon,
  ) => {
    if (!geometry) return [];
    if (geometry.type === 'Polygon') {
      return [geometry.coordinates[0]];
    } else if (geometry.type === 'MultiPolygon') {
      return geometry.coordinates.map((polygon) => polygon[0]);
    }

    return [];
  };

  return (
    <View style={[style, styles.container]}>
      {!initialRegion ? (
        <View style={styles.map}>
          <ActivityIndicator size="large" color={PRIMARY_ACCENT_COLOR} />
        </View>
      ) : (
        <MapView
          ref={mapViewRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          userInterfaceStyle={theme}
          customMapStyle={theme === 'dark' ? customMapStyle : undefined}
          onLayout={handleAnimation}
          onPress={handleMapPress}
          showsUserLocation
          followsUserLocation
        >
          {pinLocation && (
            <Marker
              pinColor="blue"
              coordinate={pinLocation}
              title="Pinned Location"
              description="You placed this pin here."
            />
          )}
          {renderPolygonCoordinates(queriedZone?.geometry).map(
            (coords, index) => (
              <Polygon
                key={index}
                coordinates={coords.map(([lon, lat]) => ({
                  latitude: lat as number,
                  longitude: lon as number,
                }))}
                strokeColor="#033dfc"
                fillColor="rgba(3, 61, 252, 0.1)"
              />
            ),
          )}
          {Object.keys(placesMap)?.map((placeKey, index) => {
            const place = placesMap[placeKey];
            const name = place?.tags?.name;

            if (place?.__typename === 'OverpassWay' && name) {
              const polygonCoordinates: LatLng[] =
                place.geometry?.map((coord) => ({
                  latitude: coord.lat,
                  longitude: coord.lon,
                })) || [];

              return (
                <View key={index}>
                  <Marker
                    pinColor="#7341c4"
                    coordinate={{
                      latitude: place.center.lat,
                      longitude: place.center.lon,
                    }}
                    title={name}
                    description="Place of interest"
                  />
                  <Polygon
                    coordinates={polygonCoordinates}
                    strokeColor="#7341c4"
                    fillColor="rgba(73, 28, 145, 0.2)"
                  />
                </View>
              );
            }

            let coordinate;
            if (place?.__typename === 'OverpassWay' && place.center) {
              coordinate = {
                latitude: place.center.lat,
                longitude: place.center.lon,
              };
            } else if (place?.__typename === 'OverpassNode') {
              coordinate = {
                latitude: place.lat,
                longitude: place.lon,
              };
            }

            if (!coordinate || !name) return;

            return (
              <Marker
                pinColor="#7341c4"
                key={index}
                coordinate={coordinate}
                title={name}
                description="Place of interest"
              />
            );
          })}
        </MapView>
      )}
    </View>
  );
};

export default Map;
