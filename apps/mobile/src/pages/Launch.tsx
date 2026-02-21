import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useQuery } from '@apollo/client';
import { useAppDispatch, useAppSelector } from '../utils/store';
import { setUserMetadata } from '../utils/slices/user';
import {
  Pressable,
  StatusBar,
  Text,
  Vibration,
  View,
  Image,
} from 'react-native';
import { FormattedMessage } from 'react-intl';
import Three from '../components/animations/Three';
import styles from './styles/Launch';
import { gql } from '@gql';

const USER_METADATA_QUERY = gql(`
  query GetUser {
    getUser {
      metadata {
        explorerScore
        numLocationsDiscovered
      }
    }
  }
`);

const Launch: FC = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  const sessionId = useAppSelector((state) => state.session.currentSessionId);
  const { data: userMetadata, refetch } = useQuery(USER_METADATA_QUERY, {
    fetchPolicy: 'no-cache',
  });
  const dispatch = useAppDispatch();
  const initialMount = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (initialMount.current) {
        initialMount.current = false;
        return;
      }

      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (userMetadata) {
      dispatch(setUserMetadata(userMetadata.getUser?.metadata));
    }
  }, [dispatch, userMetadata]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>
        <Three />
        <View style={styles.starsContainer}>
          <View style={styles.profileViewContainer}>
            <View style={styles.profileTransparencyContainer}>
              <View style={styles.imgContainer}>
                <Image
                  style={styles.img}
                  source={require('../../assets/images/astronaut.png')}
                />
              </View>
              <Text style={styles.welcomeText}>
                <FormattedMessage
                  id="Launch.welcomeMessage"
                  defaultMessage="Explorer {name}"
                  values={{ name: user?.name }}
                />
              </Text>
              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>
                    <FormattedMessage
                      id="Launch.points"
                      defaultMessage="Star Points"
                    />
                  </Text>
                  <Text style={styles.statNum}>
                    {user?.metadata?.explorerScore}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>
                    <FormattedMessage
                      id="Launch.discovered"
                      defaultMessage="Locations Discovered"
                    />
                  </Text>
                  <Text style={styles.statNum}>
                    {user?.metadata?.numLocationsDiscovered}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.controlBoardContainer}>
          <View style={styles.controlBoardOptionsContainer}>
            <Pressable
              style={[styles.launchButton, sessionId && styles.continueButton]}
              onPress={() => {
                Vibration.vibrate(50);
                router.push('/landing/exploring');
              }}
              disabled={false}
            >
              <View style={styles.buttonContentContainer}>
                <Text
                  style={[
                    styles.launchOptionText,
                    sessionId && styles.continueOptionText,
                  ]}
                >
                  {!sessionId ? (
                    <FormattedMessage
                      id="Launch.start"
                      defaultMessage="Start Exploring"
                    />
                  ) : (
                    <FormattedMessage
                      id="Launch.continue"
                      defaultMessage="Continue Exploring"
                    />
                  )}
                </Text>
                <Image
                  style={[
                    styles.rocketIcon,
                    sessionId && styles.rocketIconContinue,
                  ]}
                  source={require('../../assets/images/rocket.png')}
                />
              </View>
            </Pressable>
          </View>
          <Pressable
            style={styles.logoutButton}
            onPress={() => {
              Vibration.vibrate(50);
              router.replace('/logout');
            }}
            disabled={false}
          >
            <Text>
              <FormattedMessage id="Launch.logout" defaultMessage="Logout" />
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default memo(Launch);
