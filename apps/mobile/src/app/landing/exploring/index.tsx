import { FC } from 'react';
import { defineMessage, useIntl } from 'react-intl';
import { useFocusEffect } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../utils/store';
import usePOISubscription from '@/src/hooks/usePOISubscription';
import { reloadTrack } from '@/src/utils/slices/session';
import { StatusBar, View } from 'react-native';
import TextBar from '@/src/components/TextBar';
import MessageDisplay from '@/src/components/messaging/MessageDisplay';
import Map from '../../../components/Map';
import styles from './styles';

const placeholder = defineMessage({
  id: 'Exploring.textBar.placeholder',
  defaultMessage: 'Message',
});

const Exploring: FC = () => {
  const intl = useIntl();
  const { location, heading } = usePOISubscription();
  const trackPlayerInitialized = useAppSelector(
    (state) => state.audio.trackPlayerInitialized,
  );
  const dispatch = useAppDispatch();

  useFocusEffect(() => {
    dispatch(reloadTrack());
  });

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
          <MessageDisplay style={styles.messageDisplay} />
        )}
        <TextBar
          style={styles.textBar}
          placeholder={intl.formatMessage(placeholder)}
        />
      </View>
    </>
  );
};

export default Exploring;
