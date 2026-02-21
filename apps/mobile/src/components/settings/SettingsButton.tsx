import { FC } from 'react';
import { Text, Pressable } from 'react-native';
import styles from './styles/SettingsButton';

type Props = {
  label: string;
  onPress: () => void;
  danger?: boolean;
};

const SettingsButton: FC<Props> = ({ label, onPress, danger }) => {
  return (
    <Pressable
      style={[styles.container, danger && styles.dangerContainer]}
      onPress={onPress}
    >
      <Text style={[styles.settingText, danger && styles.dangerText]}>
        {label}
      </Text>
    </Pressable>
  );
};

export default SettingsButton;
