import { FC } from 'react';
import { View, Image } from 'react-native';
import styles from './styles/LogoTitle';

const LogoTitle: FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image
          style={styles.img}
          source={require('../../../assets/images/astronaut.png')}
        />
      </View>
    </View>
  );
};

export default LogoTitle;
