import { FC } from 'react';
import { Stack } from 'expo-router';
import SignUpHeader from '@/src/components/header/SignUpHeader';
import SignUpProvider from '@/src/components/providers/SignUpProvider';

const SignUpLayout: FC = () => {
  return (
    <SignUpProvider>
      <SignUpHeader />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="email"
          options={{
            title: 'Email',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            title: 'Details',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="confirmationCode"
          options={{
            title: 'Confirmation Code',
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </SignUpProvider>
  );
};

export default SignUpLayout;
