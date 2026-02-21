import { FC } from 'react';
import { useRouter } from 'expo-router';
import { setReplayAllNodes } from '@/src/utils/slices/settings';
import { useAppDispatch, useAppSelector } from '../../utils/store';
import { ScrollView, Vibration } from 'react-native';
import { defineMessages, useIntl } from 'react-intl';
import SettingsSection from '@/src/components/settings/SettingsSection';
import SettingsSwitch from '@/src/components/settings/SettingsSwitch';
import SectionLabel from '@/src/components/settings/SectionLabel';
import SettingsButton from '@/src/components/settings/SettingsButton';
import styles from './styles';

const messages = defineMessages({
  exploring: {
    id: 'Settings.exploring',
    defaultMessage: 'Exploration',
  },
  viewAllAgain: {
    id: 'Settings.viewAllSeen',
    defaultMessage: 'View all seen places again',
  },
  account: {
    id: 'Settings.account',
    defaultMessage: 'Account',
  },
  logout: {
    id: 'Settings.logout',
    defaultMessage: 'Log out',
  },
  deleteAccount: {
    id: 'Settings.deleteAccount',
    defaultMessage: 'Delete your account',
  },
});

const Settings: FC = () => {
  const intl = useIntl();
  const router = useRouter();
  const { replayAllNodes } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SectionLabel label={intl.formatMessage(messages.exploring)} />
      <SettingsSection>
        <SettingsSwitch
          label={intl.formatMessage(messages.viewAllAgain)}
          value={replayAllNodes}
          onValueChange={(value) => dispatch(setReplayAllNodes(value))}
        />
      </SettingsSection>
      <SectionLabel label={intl.formatMessage(messages.account)} />
      <SettingsSection>
        <SettingsButton
          label={intl.formatMessage(messages.logout)}
          onPress={() => {
            Vibration.vibrate(50);
            router.replace('/logout');
          }}
        />
        <SettingsButton
          label={intl.formatMessage(messages.deleteAccount)}
          onPress={() => {
            Vibration.vibrate(50);
          }}
          danger
        />
      </SettingsSection>
    </ScrollView>
  );
};

export default Settings;
