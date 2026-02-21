import { FC, useEffect, useState } from 'react';
import { useFragment, useMutation } from '@apollo/client';
import { View, Text, Pressable } from 'react-native';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import styles from './styles/StarRatingSelect';
import { gql } from '@gql';

const messages = defineMessages({
  1: {
    id: 'StarRatingSelect.1',
    defaultMessage: 'Boring!!!',
  },
  2: {
    id: 'StarRatingSelect.2',
    defaultMessage: 'Snoozer',
  },
  3: {
    id: 'StarRatingSelect.3',
    defaultMessage: 'Mildly Interesting',
  },
  4: {
    id: 'StarRatingSelect.4',
    defaultMessage: 'Pretty Interesting',
  },
  5: {
    id: 'StarRatingSelect.5',
    defaultMessage: 'Damn thats Interesting!',
  },
});

type Props = { nodeId: string };

const STAR_RATING_SELECT_FRAGMENT = gql(`
  fragment StarRatingSelect on Node {
    rating {
      myRating
    }
  }
`);

const RATE_NODE_INTEREST = gql(`
  mutation RateNodeInterest($nodeId: String!, $rating: Int!) {
    rateNodeInterest(nodeId: $nodeId, rating: $rating)
  }
`);

const StarRatingSelect: FC<Props> = ({ nodeId }) => {
  const intl = useIntl();
  const { data } = useFragment({
    fragment: STAR_RATING_SELECT_FRAGMENT,
    from: { __typename: 'Node', nodeId },
  });
  const [rating, setRating] = useState(0);
  const [rateNodeInterest, { error: rateNodeInterestError }] =
    useMutation(RATE_NODE_INTEREST);
  const myRating = data.rating?.myRating || 0;

  useEffect(() => {
    setRating(myRating);
  }, [myRating]);

  const handlePush = (index: number) => {
    const newRating = index + 1;
    if (rating === newRating) {
      setRating(0);
      rateNodeInterest({ variables: { nodeId, rating: 0 } });
    } else {
      setRating(newRating);
      rateNodeInterest({ variables: { nodeId, rating: index + 1 } });
    }
  };

  if (rateNodeInterestError) {
    console.log(rateNodeInterestError);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.numVotes}>
        <FormattedMessage
          id="StarRatingSelect.prompt"
          defaultMessage="Rate this place!"
        />
      </Text>
      <View style={styles.starContainer}>
        {[...Array(5)].map((_, index) => {
          const fullStar = index + 1 <= rating;

          const starName = fullStar ? 'star' : 'star-o';

          return (
            <Pressable key={index} onPress={() => handlePush(index)}>
              <FontAwesome
                style={styles.star}
                name={starName}
                size={16}
                color="white"
              />
            </Pressable>
          );
        })}
      </View>
      {!!rating && (
        <Text style={styles.numVotes}>
          {intl.formatMessage(messages[rating as keyof typeof messages])}
        </Text>
      )}
    </View>
  );
};

export default StarRatingSelect;
