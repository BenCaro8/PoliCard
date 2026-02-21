import { FC } from 'react';
import { View } from 'react-native';
import styles from './styles/Divider';

export type Props = { color?: string };

const Divider: FC<Props> = ({ color = '#8E8E93' }) => {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
};

export default Divider;
