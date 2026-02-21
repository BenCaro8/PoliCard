import { FC } from 'react';
import { View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFragment } from '@apollo/client';
import styles from './styles/StarRating';
import { gql } from '@gql';

type StarName = 'star-o' | 'star' | 'star-half-full';

type Props = { nodeId: string };

const STAR_RATING_FRAGMENT = gql(`
  fragment StarRating on Node {
    rating {
      numRatings
      avgRating
    }
  }
`);

const StarRating: FC<Props> = ({ nodeId }) => {
  const { data } = useFragment({
    fragment: STAR_RATING_FRAGMENT,
    from: { __typename: 'Node', nodeId },
  });
  const interestRating = data.rating?.avgRating || 0;
  const numRatings = data.rating?.numRatings || 0;

  return (
    <View style={styles.container}>
      <Text style={styles.numVotes}>{`(${numRatings})`}</Text>
      {[...Array(5)].map((_, index) => {
        const fullStar = index + 1 <= interestRating;
        const halfStar = index + 0.5 === interestRating;

        let starName: StarName = 'star-o';

        if (fullStar) {
          starName = 'star';
        } else if (halfStar) {
          starName = 'star-half-full';
        }

        return (
          <FontAwesome
            key={index}
            style={styles.star}
            name={starName}
            size={16}
            color="white"
          />
        );
      })}
    </View>
  );
};

export default StarRating;
