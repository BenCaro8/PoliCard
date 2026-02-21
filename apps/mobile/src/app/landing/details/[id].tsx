import { FC, useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import { defineMessages, useIntl } from 'react-intl';
import TrackPlayer from 'react-native-track-player';
import StarRating from '@/src/components/StarRating';
import ImageCarousel from '@/src/components/ImageCarousel';
import PlayerControls from '@/src/components/PlayerControls';
import StarRatingSelect from '@/src/components/StarRatingSelect';
import AccordionSection from '@/src/components/details/AccordionSection';
import CommentsSection from '@/src/components/details/CommentsSection';
import ImageModal from '@/src/components/ImageModal';
import styles from './styles/[id]';
import { gql } from '@gql';

const messages = defineMessages({
  info: {
    id: 'NodeDetails.info',
    defaultMessage: 'Info',
  },
});

export const NODE_DETAILS_QUERY = gql(`
  query GetNode($nodeId: String!) {
    getNode(nodeId: $nodeId) {
        nodeId
        title
        type
        location
        text
        audioUrl
        followOn
        createdAt
        updatedAt
        ...StarRating
        ...StarRatingSelect
    }
}
`);

const NodeDetails: FC = () => {
  const intl = useIntl();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { id: nodeId } = useLocalSearchParams<{ id: string }>();
  const { data } = useQuery(NODE_DETAILS_QUERY, {
    variables: { nodeId },
  });
  const loadedTrack = useRef(false);
  const { title, audioUrl, text } = data?.getNode || {};

  useEffect(() => {
    const loadTrack = async () => {
      if (audioUrl && !loadedTrack.current) {
        loadedTrack.current = true;
        await TrackPlayer.reset();
        await TrackPlayer.load({
          id: nodeId,
          url: audioUrl || '',
          title: title || 'Pocketnaut Audio',
          artist: 'Pocketnaut',
        });
      }
    };

    loadTrack();

    return () => {
      TrackPlayer.reset();
    };
  }, [audioUrl, nodeId, title]);

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
          <Text style={[styles.title, styles.yPaddedSection]}>{title}</Text>
          <StarRating nodeId={nodeId} />
        </View>
        <ImageCarousel
          nodeId={nodeId}
          handleImagePress={() => setImageModalOpen(true)}
          onIndexChange={handleIndexChange}
        />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.xPaddedSection}>
            <StarRatingSelect nodeId={nodeId} />
            <PlayerControls />
          </View>
          <AccordionSection title={intl.formatMessage(messages.info)}>
            <View style={styles.xPaddedSection}>
              <Text style={styles.text}>{`\t\t\t\t${text}`}</Text>
            </View>
          </AccordionSection>
          <CommentsSection contentContainerStyle={styles.xPaddedSection} />
        </ScrollView>
      </View>
    </>
  );
};

export default NodeDetails;
