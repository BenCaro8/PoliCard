import { FC } from 'react';
import { Stack } from 'expo-router';
import TitleWrapper from '@/src/components/header/TitleWrapper';
import { PRIMARY_ACCENT_COLOR } from '@/src/utils/shared/common';
import { FormattedMessage } from 'react-intl';

const DetailsLayout: FC = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerStyle: {
            backgroundColor: PRIMARY_ACCENT_COLOR,
          },
          headerShown: true,
          title: '',
          headerLeft: () => (
            <TitleWrapper backButton>
              <FormattedMessage
                id="DetailsLayout.header"
                defaultMessage="Details"
              />
            </TitleWrapper>
          ),
        }}
      />
    </Stack>
  );
};

export default DetailsLayout;
