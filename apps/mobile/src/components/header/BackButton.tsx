import { FC } from 'react';
import { View } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import { SECONDARY_FONT_COLOR } from '@/src/utils/shared/common';
import { useRouter } from 'expo-router';
import styles from './styles/BackButton';

const BackButton: FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <HeaderBackButton
        tintColor={SECONDARY_FONT_COLOR}
        onPress={router.back}
      />
    </View>
  );
};

export default BackButton;
