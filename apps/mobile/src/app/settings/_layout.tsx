import { FC } from 'react';
import { Stack } from 'expo-router';
import {
  PRIMARY_ACCENT_COLOR,
  PRIMARY_FONT_COLOR,
} from '@/src/utils/shared/common';

const SettingsLayout: FC = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: PRIMARY_ACCENT_COLOR,
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitleStyle: {
            color: PRIMARY_FONT_COLOR,
          },
          headerShown: true,
          title: 'Settings',
        }}
      />
    </Stack>
  );
};

export default SettingsLayout;
