import { FC } from 'react';
import { selectNode } from '../../utils/slices/pastSession';
import { useAppDispatch, useAppSelector } from '../../utils/store';
import { Text } from 'react-native';
import TypingIndicator from '../animations/TypingIndicator';
import TextBubble from '../messaging/Bubble';
import PlayerControls from '../PlayerControls';
import Divider from '../Divider';
import { PRIMARY_ACCENT_COLOR } from '@/src/utils/shared/common';
import styles from './styles/PastMessage';

export type Props = { nodeId: string; text?: string };

const Message: FC<Props> = ({ nodeId, text: textArg = '' }) => {
  const { currentNode } = useAppSelector((state) => state.pastSession);
  const {
    title,
    text: textData,
    loading,
    error,
  } = useAppSelector((state) => state.nodes.nodes[nodeId]);
  const dispatch = useAppDispatch();

  const isCurrentNode = currentNode === nodeId;

  const handlePush = () => {
    if (!isCurrentNode) dispatch(selectNode({ id: nodeId }));
  };

  const text = (textArg || textData || title)?.trim();

  if (error) {
    console.error(error);
  }

  if (loading)
    return (
      <TextBubble>
        <TypingIndicator />
      </TextBubble>
    );

  if (!text) return;

  return (
    <TextBubble
      handlePress={handlePush}
      contentContainerStyle={[
        styles.textBubble,
        isCurrentNode && styles.currentInteraction,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
      <Divider color={isCurrentNode ? PRIMARY_ACCENT_COLOR : undefined} />
      <Text style={styles.text}>{text}</Text>
      {isCurrentNode && <PlayerControls />}
    </TextBubble>
  );
};

export default Message;
