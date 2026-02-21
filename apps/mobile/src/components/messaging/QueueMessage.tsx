import { FC, useState, useRef, useEffect } from 'react';
import { Animated, Pressable, View, Text } from 'react-native';
import { useAppSelector } from '../../utils/store';
import { FormattedMessage } from 'react-intl';
import Ionicons from '@expo/vector-icons/Ionicons';
import TextBubble from './Bubble';
import styles from './styles/QueueMessage';

const QueueMessage: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { placesMap } = useAppSelector((state) => state.map);
  const { nodeQueue } = useAppSelector((state) => state.session);
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
    <TextBubble>
      <View style={styles.titleContainer}>
        <Text style={{ color: 'white' }}>
          <FormattedMessage
            id="QueueMessage.queueMessage"
            defaultMessage="{num} Place(s) Next In Queue"
            values={{ num: nodeQueue?.length || 0 }}
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
      {isExpanded && (
        <View style={styles.cellContainer}>
          {nodeQueue.map((nodeId, index) => {
            const place = nodeId ? placesMap[nodeId] : null;
            const name = place?.tags?.name;
            return (
              <View key={nodeId} style={styles.queueCell}>
                <View key={nodeId} style={styles.queueNum}>
                  <Text style={{ color: 'white' }}>{`${index + 1}.`}</Text>
                </View>
                <Text style={{ color: 'white' }}>{name}</Text>
              </View>
            );
          })}
        </View>
      )}
    </TextBubble>
  );
};

export default QueueMessage;
