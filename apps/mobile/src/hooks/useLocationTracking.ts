import { useEffect, useState } from 'react';
import { LatLng } from 'react-native-maps';
import {
  requestForegroundPermissionsAsync,
  watchPositionAsync,
  Accuracy,
  LocationSubscription,
} from 'expo-location';

const useLocationTracking = () => {
  const [location, setLocation] = useState<LatLng>();
  const [heading, setHeading] = useState<number>();
  const [speed, setSpeed] = useState<number>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let subscription: LocationSubscription;
    const startTracking = async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      subscription = await watchPositionAsync(
        {
          accuracy: Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (locationObj) => {
          const {
            latitude,
            longitude,
            heading: newHeading,
            speed: newSpeed,
          } = locationObj.coords;

          setLocation({ latitude, longitude });
          setHeading(newHeading || undefined);
          setSpeed(newSpeed || undefined);
        },
      );
    };

    startTracking();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { location, heading, speed, error };
};

export default useLocationTracking;
