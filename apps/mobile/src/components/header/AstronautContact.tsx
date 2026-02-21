import { FC } from 'react';
import { View, Text, Image } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { HeaderBackButton } from '@react-navigation/elements';
import { SECONDARY_FONT_COLOR } from '@/src/utils/shared/common';
import { useRouter } from 'expo-router';
import styles from './styles/AstronautContact';

const AstronautContact: FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <HeaderBackButton
        tintColor={SECONDARY_FONT_COLOR}
        onPress={router.back}
      />
      <View style={styles.imgContainer}>
        <Image
          style={styles.img}
          source={require('../../../assets/images/astronaut.png')}
        />
      </View>
      <Text style={styles.contactName}>
        <FormattedMessage
          id="AstronautContact.astronaut"
          defaultMessage="Pocketnaut"
        />
      </Text>
    </View>
  );
};

export default AstronautContact;
