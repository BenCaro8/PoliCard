import { FC, useEffect } from 'react';
import { Stack } from 'expo-router';
import { startSessionTrigger } from '@/src/utils/middleware/storeMiddleware';
import AstronautContact from '../../../components/header/AstronautContact';
import SettingsButton from '../../../components/header/SettingsHeader';
import { useAppDispatch } from '@/src/utils/store';
import { PRIMARY_BG_COLOR } from '@/src/utils/shared/common';

const ExploringLayout: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startSessionTrigger());
  }, [dispatch]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: PRIMARY_BG_COLOR,
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerShadowVisible: true,
          headerLeft: () => <AstronautContact />,
          headerRight: () => <SettingsButton mediaControls />,
          title: '',
        }}
      />
    </Stack>
  );
};

export default ExploringLayout;
