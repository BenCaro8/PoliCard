import { FC } from 'react';
import { useAppSelector } from '../../../utils/store';
import usePOISubscription from '@/src/hooks/usePOISubscription';
import { StatusBar, View } from 'react-native';
import PastMessageDisplay from '@/src/components/pastMessaging/PastMessageDisplay';
import Map from '../../../components/Map';
import styles from './styles';

const Exploring: FC = () => {
  const { location, heading } = usePOISubscription();

  const trackPlayerInitialized = useAppSelector(
    (state) => state.audio.trackPlayerInitialized,
  );

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>
        <Map style={styles.map} location={location} heading={heading} />
        {trackPlayerInitialized && (
          <PastMessageDisplay style={styles.messageDisplay} />
        )}
      </View>
    </>
  );
};

export default Exploring;
