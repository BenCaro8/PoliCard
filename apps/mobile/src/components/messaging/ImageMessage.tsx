import { FC, useState } from 'react';
import { Image } from 'react-native';
import { useAppSelector } from '../../utils/store';
import ImageModal from '../ImageModal';
import TextBubble from './Bubble';
import styles from './styles/ImageMessage';
import UploadImage from '../UploadImage';

export type Props = { nodeId: string };

const ImageMessage: FC<Props> = ({ nodeId }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const { currentNode } = useAppSelector((state) => state.session);
  const { primaryImageUrl, loading, error } = useAppSelector(
    (state) => state.nodes.nodes[nodeId],
  );

  const isCurrentNode = currentNode === nodeId;

  const handlePushImageModal = () => setImageModalOpen(true);

  if (error) {
    console.error(error);
  }

  if (loading) return;

  if (!primaryImageUrl)
    return (
      <TextBubble
        style={styles.bubble}
        contentContainerStyle={[
          isCurrentNode && styles.bubbleCurrentInteractionContentContainer,
        ]}
      >
        <UploadImage nodeId={nodeId} noImages type="message" />
      </TextBubble>
    );

  return (
    <>
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        nodeId={nodeId}
      />
      <TextBubble
        handlePress={handlePushImageModal}
        contentContainerStyle={[
          isCurrentNode && styles.bubbleCurrentInteractionContentContainer,
        ]}
        noPadding
      >
        <Image
          source={{ uri: primaryImageUrl }}
          style={{
            width: 200,
            height: 200,
            resizeMode: 'cover',
            borderRadius: 20,
          }}
        />
      </TextBubble>
    </>
  );
};

export default ImageMessage;
