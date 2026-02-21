import { FC } from 'react';
import { View, Text } from 'react-native';
import styles from './styles/SectionLabel';

type Props = {
  label: string;
};

const SectionLabel: FC<Props> = ({ label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default SectionLabel;
