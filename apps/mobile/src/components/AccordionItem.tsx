import { FC, ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styles from './styles/AccordionItem';

export type Props = {
  isExpanded: SharedValue<boolean>;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  duration?: number;
};

const AccordionItem: FC<Props> = ({
  isExpanded,
  children,
  style,
  duration = 500,
}) => {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    }),
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View style={[styles.animatedView, bodyStyle, style]}>
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}
      >
        {children}
      </View>
    </Animated.View>
  );
};

export default AccordionItem;
