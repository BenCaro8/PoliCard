import { FC } from 'react';
import { View, Switch, Text } from 'react-native';
import { PRIMARY_ACCENT_COLOR } from '@/src/utils/shared/common';
import styles from './styles/SettingsSwitch';

type Props = {
  label: string;
  value?: boolean;
  onValueChange: (value: boolean) => void;
};

const SettingsSwitch: FC<Props> = ({ label, value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.settingText}>{label}</Text>
      <Switch
        style={styles.switch}
        trackColor={{ false: '#767577', true: PRIMARY_ACCENT_COLOR }}
        thumbColor="white"
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};

export default SettingsSwitch;
