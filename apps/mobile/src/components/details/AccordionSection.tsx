import { FC, ReactNode } from 'react';
import { Pressable, View, Text } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AccordionItem from '@/src/components/AccordionItem';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from './styles/AccordionSection';

type Props = {
  title: string;
  children: ReactNode;
};

const AccordionSection: FC<Props> = ({ title, children }) => {
  const isExpanded = useSharedValue(false);
  const rotateValue = useSharedValue(0);

  useAnimatedReaction(
    () => isExpanded.value,
    (expanded, previous) => {
      if (expanded !== previous) {
        rotateValue.value = withTiming(expanded ? 180 : 0, {
          duration: 200,
        });
      }
    },
  );

  const caretStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  return (
    <>
      <View style={styles.expandContainer}>
        <Text style={styles.title}>{title}</Text>
        <Pressable
          onPress={() => (isExpanded.value = !isExpanded.value)}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? '#e0e0e0' : undefined },
          ]}
        >
          <Animated.View style={caretStyle}>
            <Ionicons name="caret-down-circle" size={20} color="white" />
          </Animated.View>
        </Pressable>
      </View>
      <AccordionItem isExpanded={isExpanded}>{children}</AccordionItem>
    </>
  );
};

export default AccordionSection;
