import { FC } from 'react';
import { selectNode } from '../../utils/slices/session';
import { useAppDispatch, useAppSelector } from '../../utils/store';
import { Text } from 'react-native';
import SuggestionMessage from './SuggestionMessage';
import TypingIndicator from '../animations/TypingIndicator';
import TextBubble from './Bubble';
import PlayerControls from '../PlayerControls';
import Divider from '../Divider';
import { PRIMARY_ACCENT_COLOR } from '@/src/utils/shared/common';
import styles from './styles/Message';

export type Props = { nodeId: string; text?: string };

const Message: FC<Props> = ({ nodeId, text: textArg = '' }) => {
  const { currentNode } = useAppSelector((state) => state.session);
  const {
    title,
    text: textData,
    followOn,
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
    <>
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
      {isCurrentNode && followOn && (
        <SuggestionMessage suggestions={followOn} />
      )}
    </>
  );
};

export default Message;
