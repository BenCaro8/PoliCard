import { FC, useState, useRef, useEffect } from 'react';
import { Animated, Pressable, View, Text } from 'react-native';
import { FormattedMessage } from 'react-intl';
import ScrollingSuggestion from './ScrollingSuggestion';
import Ionicons from '@expo/vector-icons/Ionicons';
import TextBubble from './Bubble';
import Divider from '../Divider';
import styles from './styles/SuggestionMessage';

type Props = {
  suggestions: string[];
};

const SuggestionMessage: FC<Props> = ({ suggestions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotationAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotationAnim]);

  const rotate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TextBubble style={{}}>
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>
          <FormattedMessage
            id="SuggestionMessage.followOn"
            defaultMessage="Suggestions to learn more!"
          />
        </Text>
        <Pressable
          onPress={() => setIsExpanded(!isExpanded)}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? '#e0e0e0' : undefined },
          ]}
        >
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="caret-down-circle" size={20} color="white" />
          </Animated.View>
        </Pressable>
      </View>
      {isExpanded &&
        suggestions.map((suggestion, index) => {
          return (
            <View key={index} style={{ width: '100%' }}>
              <Divider />
              <ScrollingSuggestion
                key={index}
                suggestion={suggestion}
                onCopy={() => console.log(suggestion)}
              />
              <Divider />
            </View>
          );
        })}
    </TextBubble>
  );
};

export default SuggestionMessage;
