import { FC, useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAppSelector } from '../../utils/store';
import TrackPlayer, { Event, Capability } from 'react-native-track-player';
import playbackService from '../../services/playbackService';
import PagerProvider from '@/src/components/providers/PagerProvider';
import PagerViewHeaderLeft from '@/src/components/header/PagerViewHeaderLeft';
import PagerViewHeaderRight from '@/src/components/header/PagerViewHeaderRight';
import {
  communityLoadTrigger,
  historyLoadTrigger,
} from '@/src/utils/middleware/storeMiddleware';
import { setTrackPlayerInitialized } from '../../utils/slices/audio';
import { useAppDispatch } from '../../utils/store';
import {
  PRIMARY_ACCENT_COLOR,
  PRIMARY_FONT_COLOR,
} from '@/src/utils/shared/common';

const LandingLayout: FC = () => {
  const { audioPlaybackRate } = useAppSelector((state) => state.audio);
  const trackPlayerInitialized = useAppSelector(
    (state) => state.audio.trackPlayerInitialized,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const setupPlayer = async () => {
      TrackPlayer.registerPlaybackService(() => playbackService);
      await TrackPlayer.setupPlayer({});
      TrackPlayer.updateOptions({
        progressUpdateEventInterval: 0.5,
        alwaysPauseOnInterruption: false,
        capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
      TrackPlayer.addEventListener(
        Event.PlaybackActiveTrackChanged,
        async () => {
          await TrackPlayer.pause();
        },
      );
      dispatch(setTrackPlayerInitialized(true));
    };

    if (!trackPlayerInitialized) setupPlayer();

    return () => {
      TrackPlayer.setQueue([]);
    };
  }, [dispatch, trackPlayerInitialized]);

  useEffect(() => {
    dispatch(historyLoadTrigger());
    dispatch(communityLoadTrigger());
  }, [dispatch]);

  useEffect(() => {
    TrackPlayer.setRate(audioPlaybackRate);
  }, [audioPlaybackRate]);

  return (
    <PagerProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: PRIMARY_ACCENT_COLOR,
          },
          headerShadowVisible: false,
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitleStyle: {
              color: PRIMARY_FONT_COLOR,
            },
            headerShown: true,
            title: '',
            headerLeft: () => <PagerViewHeaderLeft />,
            headerRight: () => <PagerViewHeaderRight />,
          }}
        />
        <Stack.Screen
          name="history"
          options={{
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            animation: 'fade_from_bottom',
          }}
        />
      </Stack>
    </PagerProvider>
  );
};

export default LandingLayout;
