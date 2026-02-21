import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Feather from '@expo/vector-icons/Feather';
import Slider from '@react-native-community/slider';
import { PRIMARY_ACCENT_COLOR } from '../utils/shared/common';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import styles from './styles/PlayerControls';

const PlayerControls = () => {
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress();
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);

  const isPlaying = playbackState.state === State.Playing;

  const playPause = async () => {
    isPlaying ? await TrackPlayer.pause() : await TrackPlayer.play();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const onSlidingStart = () => {
    setIsSeeking(true);
  };

  const onSlidingComplete = async (value: number) => {
    await TrackPlayer.seekTo(value);
    setIsSeeking(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={playPause}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? '#e0e0e0' : undefined },
        ]}
      >
        {!isPlaying ? (
          <Feather name="play" size={24} color={PRIMARY_ACCENT_COLOR} />
        ) : (
          <SimpleLineIcons
            name="control-pause"
            size={24}
            color={PRIMARY_ACCENT_COLOR}
          />
        )}
      </Pressable>
      <View style={styles.sliderTimeContainer}>
        <Slider
          value={isSeeking ? seekPosition : position}
          minimumValue={0}
          maximumValue={duration}
          onValueChange={(value) => setSeekPosition(value)}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingComplete}
          minimumTrackTintColor={PRIMARY_ACCENT_COLOR}
          maximumTrackTintColor="#8E8E93"
          thumbTintColor={PRIMARY_ACCENT_COLOR}
          style={styles.slider}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.text}>
            {formatTime(isSeeking ? seekPosition : position)}
          </Text>
          {duration ? (
            <Text style={styles.text}>{formatTime(duration)}</Text>
          ) : (
            <ActivityIndicator
              style={styles.durationLoad}
              size="small"
              color={PRIMARY_ACCENT_COLOR}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default PlayerControls;
