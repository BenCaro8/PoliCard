import { FC } from 'react';
import { View, Text, ViewStyle, StyleProp } from 'react-native';
import { defineMessage, FormattedMessage, useIntl } from 'react-intl';
// import { FlashList } from '@shopify/flash-list';
import styles from './styles/CommentsSection';
import TextBar from '../TextBar';
// import { gql } from '@gql';

const placeholder = defineMessage({
  id: 'CommentsSection.textBar.addComment',
  defaultMessage: 'Add a Comment',
});

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
};

// const GET_POPULAR_COMMENTS_QUERY = gql(`
//   query GetPopularComments($page: Int!, $pageSize: Int!) {
//     getNewestNodes(page: $page, pageSize: $pageSize) {
//       nodes {
//         nodeId
//         ...CommunityCard
//       }
//       hasMore
//     }
//   }
// `);

const CommentsSection: FC<Props> = ({ contentContainerStyle }) => {
  const intl = useIntl();
  const noComments = true;
  // const { data } = useQuery(GET_NEWEST_NODES_QUERY, {
  //   variables: { page: 1, pageSize: 6 },
  // });

  // const communityData = data?.getNewestNodes?.nodes.map((node) => ({
  //   nodeId: node.nodeId,
  // }));

  // const renderItem = ({ item }: { item: { nodeId: string } }) => {
  //   return <CommunityCard key={item.nodeId} nodeId={item.nodeId} />;
  // };

  // const keyExtractor = (item: { nodeId: string }) => item.nodeId;

  if (noComments) {
    return (
      <>
        <View style={[styles.commentsTitleContainer, contentContainerStyle]}>
          <Text style={styles.commentsTitle}>
            <FormattedMessage
              id="CommentsSection.comments"
              defaultMessage="Comments:"
            />
          </Text>
        </View>
        <View style={[styles.noCommentsContainer, contentContainerStyle]}>
          <Text style={styles.noCommentsText}>
            <FormattedMessage
              id="CommentsSection.noComments"
              defaultMessage="No comments yet, be the first to start the conversation!"
            />
          </Text>
        </View>
        <TextBar
          style={styles.textBar}
          placeholder={intl.formatMessage(placeholder)}
        />
      </>
    );
  }

  // return (
  //   <FlashList
  //     data={communityData}
  //     estimatedItemSize={communityData?.length || 1}
  //     renderItem={renderItem}
  //     keyExtractor={keyExtractor}
  //     contentContainerStyle={styles.container}
  //     showsVerticalScrollIndicator={false}
  //   />
  // );
};

export default CommentsSection;
