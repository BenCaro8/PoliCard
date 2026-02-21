import { FC, useRef } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Message from './Message';
import ImageMessage from './ImageMessage';
import QueueMessage from './QueueMessage';
import NonReplayMessage from './NonReplayMessage';
import { useAppSelector } from '../../utils/store';
import styles from './styles/MessageDisplay';
import Animated, { LinearTransition } from 'react-native-reanimated';

type Props = {
  style: StyleProp<ViewStyle>;
};

const MessageDisplay: FC<Props> = ({ style }) => {
  const flatListRef = useRef<FlashList<{ nodeId: string }>>(null);
  const { nodeQueue, nodeDisplayOrder, nonReplayNodes } = useAppSelector(
    (state) => state.session,
  );

  const messageData = nodeDisplayOrder.map((nodeId) => ({
    nodeId,
    type: nonReplayNodes?.includes(nodeId) ? 'nonReplay' : 'replay',
  }));

  if (nodeQueue.length > 0) {
    messageData.push({ nodeId: 'queue-message', type: 'queue' });
  }

  messageData.reverse();

  const renderItem = ({
    item,
  }: {
    item: { nodeId: string; type?: string };
  }) => {
    if (item.type === 'queue') {
      return <QueueMessage />;
    }

    if (item.type === 'nonReplay') {
      return (
        <View key={item.nodeId}>
          <NonReplayMessage nodeId={item.nodeId} />
        </View>
      );
    }

    return (
      <Animated.View layout={LinearTransition} key={item.nodeId}>
        <ImageMessage nodeId={item.nodeId} />
        <Message nodeId={item.nodeId} />
      </Animated.View>
    );
  };

  const keyExtractor = (item: { nodeId: string }) => item.nodeId;

  return (
    <View style={style}>
      <FlashList
        ref={flatListRef}
        data={messageData}
        estimatedItemSize={nodeDisplayOrder.length || 1}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.container}
        inverted={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MessageDisplay;
