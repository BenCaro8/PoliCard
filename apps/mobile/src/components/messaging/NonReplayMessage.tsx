import { FC } from 'react';
import { useAppSelector } from '../../utils/store';
import { Text } from 'react-native';
import TypingIndicator from '../animations/TypingIndicator';
import TextBubble from './Bubble';
import styles from './styles/NonReplayMessage';

export type Props = { nodeId: string; text?: string };

const Message: FC<Props> = ({ nodeId, text: textArg = '' }) => {
  const {
    title,
    text: textData,
    loading,
    error,
  } = useAppSelector((state) => state.nodes.nodes[nodeId]);
  // const dispatch = useAppDispatch();

  const handlePush = () => {
    // if (!isCurrentNode) dispatch(selectNode({ id: nodeId }));
    console.log('Pushed');
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
    <TextBubble handlePress={handlePush} style={styles.bubble}>
      <Text style={styles.text}>{title}</Text>
    </TextBubble>
  );
};

export default Message;
