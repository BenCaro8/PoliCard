import { FC } from 'react';
import { View, Image } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import { SECONDARY_FONT_COLOR } from '@/src/utils/shared/common';
import { useSignUpContext } from '../providers/SignUpProvider';
import { useRouter } from 'expo-router';
import styles from './styles/SignUpHeader';

const SignUpHeader: FC = () => {
  const router = useRouter();
  const showBackButton = useSignUpContext().state.showBackButton;

  return (
    <View style={[styles.container, styles.shadow]}>
      <View style={[styles.leftContainer]}>
        {showBackButton && (
          <HeaderBackButton
            tintColor={SECONDARY_FONT_COLOR}
            onPress={router.back}
          />
        )}
      </View>
      <View style={[styles.centerContainer]}>
        <View style={styles.imgContainer}>
          <Image
            style={styles.img}
            source={require('../../../assets/images/astronaut.png')}
          />
        </View>
      </View>
      <View style={[styles.rightContainer]} />
    </View>
  );
};

export default SignUpHeader;
