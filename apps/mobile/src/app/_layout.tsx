import { FC, useEffect } from 'react';
import { Linking } from 'react-native';
import { router, Stack } from 'expo-router';
import AppProviders from '../components/AppProviders';
import * as FileSystem from 'expo-file-system';

const RootLayout: FC = () => {
  const audioDir = `${FileSystem.cacheDirectory}audio/`;

  useEffect(() => {
    const handleDeepLink = (url: string) => {
      console.log(url);
      if (url === 'trackplayer://notification.click') {
        router.push('/landing/exploring');
      }
    };

    const listener = Linking.addEventListener('url', ({ url }) =>
      handleDeepLink(url),
    );
    return () => listener.remove();
  }, []);

  useEffect(() => {
    FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });

    const deleteCachedFiles = async () => {
      try {
        const files = await FileSystem.readDirectoryAsync(audioDir);
        for (const file of files) {
          const fileUri = `${audioDir}${file}`;
          await FileSystem.deleteAsync(fileUri);
          console.log(`Deleted: ${fileUri}`);
        }
      } catch (error) {
        console.error(
          `Error deleting files in ${FileSystem.cacheDirectory}:`,
          error,
        );
      }
    };

    return () => {
      deleteCachedFiles();
    };
  }, [audioDir]);

  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{ title: 'Home', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="landing"
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="login/sign-up"
          options={{
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
      </Stack>
    </AppProviders>
  );
};

export default RootLayout;
