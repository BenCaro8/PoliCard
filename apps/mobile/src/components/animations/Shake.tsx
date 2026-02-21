import { FC, MutableRefObject, ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export type ShakeFunc = { triggerAnim: () => void };

type Props = {
  children: ReactNode;
  funcRef: MutableRefObject<ShakeFunc | null>;
  style?: StyleProp<ViewStyle>;
};

const Shake: FC<Props> = ({ children, funcRef, style }) => {
  const shake = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(shake.value, {
            damping: 5,
            stiffness: 500,
          }),
        },
      ],
    };
  });

  const triggerAnim = () => {
    shake.value = -10;
    setTimeout(() => (shake.value = 0), 100);
  };

  if (funcRef && typeof funcRef === 'object' && funcRef !== null) {
    funcRef.current = { triggerAnim };
  }

  return <Animated.View style={[shakeStyle, style]}>{children}</Animated.View>;
};

export default Shake;
