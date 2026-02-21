import { FC, useEffect } from 'react';
import { useAppDispatch } from '../../utils/store';
import { useRouter } from 'expo-router';
import { apolloClient } from '@/src/utils/apollo';
import { endUserLoginSession } from '@/src/utils/slices/user';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import styles from './styles';

const Logout: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(endUserLoginSession());
    router.replace('/login');
    apolloClient.clearStore();
  }, [dispatch, router]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>
        <ActivityIndicator size={64} color="white" />
      </View>
    </>
  );
};

export default Logout;
