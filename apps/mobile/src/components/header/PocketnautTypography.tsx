import { FC } from 'react';
import { View, Text } from 'react-native';
import styles from './styles/PocketnautTypography';

const PocketnautTypography: FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pocketnaut</Text>
    </View>
  );
};

export default PocketnautTypography;
