import { FC } from 'react';
import { RefreshControl } from 'react-native';
import { useQuery } from '@apollo/client';
import { FlashList } from '@shopify/flash-list';
import CommunityCard from '../components/CommunityCard';
import styles from './styles/Community';
import { gql } from '@gql';
import { PRIMARY_ACCENT_COLOR } from '../utils/shared/common';

const GET_NEWEST_NODES_QUERY = gql(`
  query GetNewestNodes($page: Int!, $pageSize: Int!) {
    getNewestNodes(page: $page, pageSize: $pageSize) {
      nodes { 
        nodeId
        ...CommunityCard
        ...StarRating
        ...StarRatingSelect
      }
      hasMore
    }
  }
`);

const Community: FC = () => {
  const { data, loading, refetch } = useQuery(GET_NEWEST_NODES_QUERY, {
    variables: { page: 1, pageSize: 6 },
  });

  const communityData = data?.getNewestNodes?.nodes.map((node) => ({
    nodeId: node.nodeId,
  }));

  const onRefresh = () => {
    refetch();
  };

  const renderItem = ({ item }: { item: { nodeId: string } }) => {
    return <CommunityCard key={item.nodeId} nodeId={item.nodeId} />;
  };

  const keyExtractor = (item: { nodeId: string }) => item.nodeId;

  return (
    <FlashList
      data={communityData}
      estimatedItemSize={communityData?.length || 1}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={PRIMARY_ACCENT_COLOR}
          colors={[PRIMARY_ACCENT_COLOR]}
        />
      }
    />
  );
};

export default Community;
