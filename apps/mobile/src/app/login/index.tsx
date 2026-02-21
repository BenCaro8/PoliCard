import { FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { SECONDARY_FONT_COLOR } from '../../utils/shared/common';
import { gql } from '@gql';
import { useMutation } from '@apollo/client';
import { useAppDispatch, useAppSelector } from '../../utils/store';
import { setUser } from '../../utils/slices/user';
import { useRouter } from 'expo-router';
import {
  Text,
  View,
  StatusBar,
  TextInput,
  Pressable,
  Vibration,
} from 'react-native';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import styles from './styles';

const messages = defineMessages({
  email: {
    id: 'Login.email',
    defaultMessage: 'Email',
  },
  password: {
    id: 'Login.password',
    defaultMessage: 'Password',
  },
});

const LOGIN_MUTATION = gql(`
  mutation Login($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
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

const Login: FC = () => {
  const intl = useIntl();
  const isDevelopment = useAppSelector((state) => state.settings.development);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput>(null);
  const [login, { data: loginData, error: loginError }] =
    useMutation(LOGIN_MUTATION);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleTextChange = (
    value: string,
    setState: (value: SetStateAction<string>) => void,
  ) => {
    setState(value);
  };

  useEffect(() => {
    if (loginData?.loginUser) {
      dispatch(
        setUser({
          id: loginData.loginUser?.id || '',
          email: loginData.loginUser?.email || '',
          name: loginData.loginUser?.name || '',
          metadata: loginData.loginUser?.metadata,
        }),
      );
      router.replace('/landing');
    }
  }, [dispatch, loginData, router]);

  useEffect(() => {
    if (loginError && loginError.message === 'User is not confirmed.') {
      router.push(
        `/login/sign-up/confirmationCode?email=${email}&password=${password}`,
      );
    }
  }, [email, loginError, password, router]);

  const isSubmitDisabled = !email.trim() || !password.trim();

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>
        <View style={styles.loginTitleContainer}>
          <Text style={styles.appTitle}>
            <FormattedMessage id="Login.name" defaultMessage="Pocketnaut" />
          </Text>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            <FormattedMessage id="Login.login" defaultMessage="Login" />
          </Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(value) => handleTextChange(value, setEmail)}
            value={email}
            placeholder={intl.formatMessage(messages.email)}
            placeholderTextColor={SECONDARY_FONT_COLOR}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <TextInput
            secureTextEntry
            ref={passwordRef}
            style={styles.input}
            autoCapitalize="none"
            onChangeText={(value) => handleTextChange(value, setPassword)}
            value={password}
            placeholder={intl.formatMessage(messages.password)}
            placeholderTextColor={SECONDARY_FONT_COLOR}
            returnKeyType="done"
            onSubmitEditing={() => login({ variables: { email, password } })}
          />
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.submitButton}
              onPress={() => {
                Vibration.vibrate(50);
                router.push('/login/sign-up/email');
              }}
            >
              <Text style={styles.submitText}>
                <FormattedMessage id="Login.signUp" defaultMessage="Sign Up" />
              </Text>
            </Pressable>
            <Pressable
              style={styles.submitButton}
              onPress={() => {
                Vibration.vibrate(50);
                login({ variables: { email, password } });
              }}
              disabled={isSubmitDisabled}
            >
              <Text style={styles.submitText}>
                <FormattedMessage id="Login.submit" defaultMessage="Submit" />
              </Text>
            </Pressable>
          </View>
          {isDevelopment && (
            <View style={styles.debugButtonContainer}>
              <Pressable
                style={styles.debugButton}
                onPress={() => {
                  Vibration.vibrate(50);
                  login({
                    variables: {
                      email: process.env.EXPO_PUBLIC_DEBUG_EMAIL || '',
                      password: process.env.EXPO_PUBLIC_DEBUG_PASSWORD || '',
                    },
                  });
                }}
              >
                <Text style={styles.submitText}>
                  <FormattedMessage
                    id="Login.debugLogin"
                    defaultMessage="Debug Login"
                  />
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default Login;
