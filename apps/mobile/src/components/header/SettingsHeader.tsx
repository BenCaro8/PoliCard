import { FC, useState } from 'react';
import { useRouter } from 'expo-router';
import { endSessionTrigger } from '@/src/utils/middleware/storeMiddleware';
import { useAppDispatch } from '@/src/utils/store';
import { Pressable, Animated, View } from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { SECONDARY_FONT_COLOR } from '@/src/utils/shared/common';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import styles from './styles/SettingsHeader';

type Props = {
  mediaControls?: boolean;
};

const SettingsHeader: FC<Props> = ({ mediaControls = false }) => {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const [scale] = useState(new Animated.Value(1));
  const dispatch = useAppDispatch();

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleEndSession = () => {
    router.dismissAll();
    router.replace('/landing');
    dispatch(endSessionTrigger());
  };

  return (
    <View style={styles.container}>
      {mediaControls && (
        <View style={styles.mediaContainer}>
          <Pressable
            onPress={handleEndSession}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => [
              styles.mediaButton,
              { backgroundColor: pressed ? '#e0e0e0' : undefined },
            ]}
          >
            <Ionicons
              style={styles.icon}
              name="stop-outline"
              size={22}
              color={SECONDARY_FONT_COLOR}
            />
          </Pressable>
          <Pressable
            onPress={() => setIsPaused(!isPaused)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => [
              styles.mediaButton,
              { backgroundColor: pressed ? '#e0e0e0' : undefined },
            ]}
          >
            {isPaused ? (
              <Feather
                style={styles.icon}
                name="play"
                size={18}
                color={SECONDARY_FONT_COLOR}
              />
            ) : (
              <SimpleLineIcons
                style={styles.icon}
                name="control-pause"
                size={18}
                color={SECONDARY_FONT_COLOR}
              />
            )}
          </Pressable>
        </View>
      )}
      <Pressable
        onPress={() => router.push('/settings')}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.settingsButton,
          { backgroundColor: pressed ? '#e0e0e0' : undefined },
        ]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Entypo
            style={styles.icon}
            name="dots-three-vertical"
            size={16}
            color={SECONDARY_FONT_COLOR}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default SettingsHeader;
