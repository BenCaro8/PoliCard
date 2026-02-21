import { FC, memo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useFragment } from '@apollo/client';
import { View, Text, TouchableOpacity } from 'react-native';
import { FormattedMessage } from 'react-intl';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ImageCarousel from './ImageCarousel';
import ImageModal from './ImageModal';
import StarRating from './StarRating';
import styles from './styles/CommunityCard';
import { gql } from '@gql';

type Props = {
  nodeId: string;
};

export const COMMUNITY_CARD_FRAGMENT = gql(`
  fragment CommunityCard on Node {
    title
    type
    location
    text
    audioUrl
  }
`);

const CommunityCard: FC<Props> = ({ nodeId }) => {
  const router = useRouter();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    data: { title },
  } = useFragment({
    fragment: COMMUNITY_CARD_FRAGMENT,
    from: { __typename: 'Node', nodeId },
  });

  const handlePush = () => {
    router.push(`/landing/details/${nodeId}`);
  };

  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        nodeId={nodeId}
        defaultIndex={currentIndex}
      />
      <View style={styles.container}>
        <View style={[styles.xPaddedSection, styles.spaceBetween]}>
          <Text style={styles.title}>{title}</Text>
          <StarRating nodeId={nodeId} />
        </View>
        <View style={styles.yPaddedSection}>
          <ImageCarousel
            nodeId={nodeId}
            handleImagePress={() => setImageModalOpen(true)}
            onIndexChange={handleIndexChange}
          />
        </View>
        <View style={[styles.xPaddedSection, styles.bottomPaddedSection]}>
          <TouchableOpacity style={styles.commentsSection} onPress={handlePush}>
            <FontAwesome name="comments" size={24} color="white" />
            <Text style={styles.text}>
              <FormattedMessage
                id="CommunityCard.comments"
                defaultMessage="Comments"
              />
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.viewDetails} onPress={handlePush}>
            <Text style={styles.text}>
              <FormattedMessage
                id="CommunityCard.viewDetails"
                defaultMessage="View Details"
              />
            </Text>
            <FontAwesome
              style={styles.chevron}
              name="chevron-right"
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default memo(CommunityCard);
