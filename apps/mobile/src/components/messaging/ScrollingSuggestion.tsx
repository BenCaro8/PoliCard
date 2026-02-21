import { FC, useRef, useState, useEffect } from 'react';
import { View, Animated, Pressable, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PRIMARY_ACCENT_COLOR } from '@/src/utils/shared/common';
import styles from './styles/Message';

type Props = {
  suggestion: string;
  onCopy: () => void;
};

const ScrollingSuggestion: FC<Props> = ({ suggestion, onCopy }) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (textWidth > containerWidth) {
      setIsScrolling(true);
      const scrollDistance = textWidth - containerWidth + 30;
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollAnim, {
            toValue: -scrollDistance,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(scrollAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [textWidth, containerWidth, scrollAnim]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        overflow: 'hidden',
      }}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <Animated.Text
          style={[
            styles.text,
            {
              transform: [{ translateX: isScrolling ? scrollAnim : 0 }],
            },
          ]}
          onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
          numberOfLines={1}
        >
          {suggestion}
        </Animated.Text>
      </ScrollView>
      <Pressable onPress={onCopy} style={{ marginLeft: 8 }}>
        <Ionicons
          name="document-text-outline"
          size={20}
          color={PRIMARY_ACCENT_COLOR}
        />
      </Pressable>
    </View>
  );
};

export default ScrollingSuggestion;
