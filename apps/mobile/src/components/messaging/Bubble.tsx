import { FC, ReactNode } from 'react';
import { View, Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import styles from './styles/Bubble';

export type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  handlePress?: () => void;
  sent?: boolean;
  noPadding?: boolean;
};

const Bubble: FC<Props> = ({
  children,
  style,
  contentContainerStyle,
  handlePress,
  sent = false,
  noPadding = false,
}) => {
  return (
    <Pressable
      onPress={handlePress}
      style={[style, sent ? styles.pressableSent : styles.pressableReceived]}
    >
      <Animated.View
        style={[
          contentContainerStyle,
          styles.textBubble,
          sent ? styles.sent : styles.received,
          !noPadding ? styles.textBubblePadding : undefined,
        ]}
        layout={LinearTransition}
      >
        <View style={styles.contentContainer}>{children}</View>
      </Animated.View>
    </Pressable>
  );
};

export default Bubble;
