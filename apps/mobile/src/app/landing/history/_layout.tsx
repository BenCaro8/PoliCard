import { FC, useEffect } from 'react';
import { Stack } from 'expo-router';
import { startPastSessionTrigger } from '@/src/utils/middleware/storeMiddleware';
import { useAppDispatch, useAppSelector } from '@/src/utils/store';
import AstronautContact from '@/src/components/header/AstronautContact';
import SettingsButton from '@/src/components/header/SettingsHeader';
import { resetPastSessionData } from '@/src/utils/slices/pastSession';
import { PRIMARY_BG_COLOR } from '@/src/utils/shared/common';

const PastSessionLayout: FC = () => {
  const dispatch = useAppDispatch();
  const { currentSessionId } = useAppSelector((state) => state.pastSession);

  useEffect(() => {
    dispatch(
      startPastSessionTrigger({ sessionId: currentSessionId || '', page: 1 }),
    );
  }, [currentSessionId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetPastSessionData());
    };
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
          headerRight: () => <SettingsButton />,
          title: '',
        }}
      />
    </Stack>
  );
};

export default PastSessionLayout;
