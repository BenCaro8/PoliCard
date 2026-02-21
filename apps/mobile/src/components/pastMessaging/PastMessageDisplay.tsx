import { FC, useRef } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import PastMessage from './PastMessage';
import ImageMessage from '../messaging/ImageMessage';
import { useAppSelector } from '../../utils/store';
import styles from './styles/PastMessageDisplay';
import Animated, { LinearTransition } from 'react-native-reanimated';

type Props = {
  style: StyleProp<ViewStyle>;
};

const PastMessageDisplay: FC<Props> = ({ style }) => {
  const flatListRef = useRef<FlashList<{ nodeId: string }>>(null);
  const { nodeDisplayOrder } = useAppSelector((state) => state.pastSession);

  const messageData = nodeDisplayOrder.map((nodeId) => ({
    nodeId,
  }));

  messageData.reverse();

  const renderItem = ({ item }: { item: { nodeId: string } }) => {
    return (
      <Animated.View layout={LinearTransition} key={item.nodeId}>
        <ImageMessage nodeId={item.nodeId} />
        <PastMessage nodeId={item.nodeId} />
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

export default PastMessageDisplay;
