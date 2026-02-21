import { FC, useEffect } from 'react';
import { gql } from '@gql';
import { useQuery } from '@apollo/client';
import { useAppDispatch } from '../utils/store';
import { setUser } from '../utils/slices/user';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import styles from './styles';

const IS_LOGGED_IN_QUERY = gql(`
  query IsUserLoggedIn {
    isUserLoggedIn {
      id
      email
      name
      metadata {
        explorerScore
        numLocationsDiscovered
      }
    }
  }
`);

const App: FC = () => {
  const { data: isLoggedInData } = useQuery(IS_LOGGED_IN_QUERY, {
    fetchPolicy: 'no-cache',
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedInData?.isUserLoggedIn) {
      dispatch(
        setUser({
          id: isLoggedInData?.isUserLoggedIn?.id || '',
          email: isLoggedInData?.isUserLoggedIn?.email || '',
          name: isLoggedInData?.isUserLoggedIn?.name || '',
          metadata: isLoggedInData?.isUserLoggedIn?.metadata,
        }),
      );
      router.replace('/landing');
    } else if (isLoggedInData?.isUserLoggedIn === null) {
      router.replace('/login');
    }
  }, [dispatch, isLoggedInData, router]);

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

export default App;
