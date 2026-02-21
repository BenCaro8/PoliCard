import { FC, ReactNode } from 'react';
import { View } from 'react-native';
import styles from './styles/SettingsSection';

type Props = {
  children: ReactNode;
};

const SettingsSection: FC<Props> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

export default SettingsSection;
