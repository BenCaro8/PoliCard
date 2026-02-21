import { FC, useEffect, useRef } from 'react';
import { SECONDARY_FONT_COLOR } from '../../../utils/shared/common';
import {
  Text,
  View,
  StatusBar,
  TextInput,
  Pressable,
  Vibration,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getDisplayNameError, getPasswordError } from '@/src/utils/validation';
import {
  State,
  useSignUpContext,
} from '@/src/components/providers/SignUpProvider';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/client';
import { gql } from '@gql';
import styles from './styles/details';
import { ShakeFunc } from '@/src/components/animations/Shake';
import AnimatedTextInput from '@/src/components/AnimatedTextInput';

const messages = defineMessages({
  displayName: {
    id: 'Details.displayName',
    defaultMessage: 'Display Name',
  },
  password: {
    id: 'Details.password',
    defaultMessage: 'Password',
  },
  confirmPassword: {
    id: 'Details.confirmPassword',
    defaultMessage: 'Confirm Password',
  },
  alreadyExists: {
    id: 'Details.alreadyExists',
    defaultMessage: 'User account with this email already exists',
  },
});

const SIGN_UP_MUTATION = gql(`
  mutation SignUpUser($email: String!, $displayName: String!, $password: String!) {
    signUpUser(email: $email, displayName: $displayName, password: $password)
  }
`);

const Details: FC = () => {
  const intl = useIntl();
  const router = useRouter();
  const { state, dispatch } = useSignUpContext();
  const [signUp, { data: signUpData, error: signUpError }] =
    useMutation(SIGN_UP_MUTATION);
  const {
    email,
    displayName,
    displayNameError,
    password,
    passwordError,
    confirmPassword,
  } = state;
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const displayNameErrorAnimRef = useRef<ShakeFunc>(null);
  const passwordErrorAnimRef = useRef<ShakeFunc>(null);
  const confirmPasswordErrorAnimRef = useRef<ShakeFunc>(null);

  const handleTextChange = (type: keyof State, value: string) => {
    dispatch({ type, payload: value });
    if (type === 'displayName') {
      dispatch({ type: 'displayNameError', payload: undefined });
    }
    if (type === 'password' || type === 'confirmPassword') {
      dispatch({ type: 'passwordError', payload: undefined });
    }
  };

  const handleSubmit = () => {
    const displayNameErr = getDisplayNameError(displayName);
    const passwordErr = getPasswordError(password, confirmPassword);

    if (!isSubmitDisabled) {
      Vibration.vibrate(50);
      if (displayNameErr) {
        dispatch({
          type: 'displayNameError',
          payload: intl.formatMessage(displayNameErr),
        });
        displayNameErrorAnimRef.current?.triggerAnim();
      }
      if (passwordErr) {
        dispatch({
          type: 'passwordError',
          payload: intl.formatMessage(passwordErr),
        });
        passwordErrorAnimRef.current?.triggerAnim();
        confirmPasswordErrorAnimRef.current?.triggerAnim();
      }
      if (!displayNameErr && !passwordErr) {
        signUp({ variables: { email, password, displayName } });
      }
    }
  };

  useEffect(() => {
    if (signUpData?.signUpUser) {
      router.dismissAll();
      router.replace('/login/sign-up/confirmationCode');
    }
    if (signUpError) {
      if (signUpError.message === 'User already exists') {
        dispatch({
          type: 'emailError',
          payload: intl.formatMessage(messages.alreadyExists),
        });
        router.back();
      }
    }
  }, [dispatch, intl, router, signUpData, signUpError]);

  const isSubmitDisabled =
    !displayName.trim() || !password.trim() || !confirmPassword;

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>
        <View style={styles.welcomeMessageContainer}>
          <Text style={styles.welcomeMessage}>
            <FormattedMessage
              id="Details.setUp"
              defaultMessage="Set up your account!"
            />
          </Text>
        </View>
        <AnimatedTextInput
          animRef={displayNameErrorAnimRef}
          style={[
            styles.input,
            displayNameError ? styles.inputError : undefined,
          ]}
          autoCapitalize="none"
          onChangeText={(value) => handleTextChange('displayName', value)}
          value={displayName}
          placeholder={intl.formatMessage(messages.displayName)}
          placeholderTextColor={SECONDARY_FONT_COLOR}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
          error={displayNameError}
        />
        <AnimatedTextInput
          animRef={passwordErrorAnimRef}
          secureTextEntry
          ref={passwordRef}
          style={styles.input}
          autoCapitalize="none"
          onChangeText={(value) => handleTextChange('password', value)}
          value={password}
          placeholder={intl.formatMessage(messages.password)}
          placeholderTextColor={SECONDARY_FONT_COLOR}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          noErrorText
          error={passwordError}
        />
        <AnimatedTextInput
          animRef={confirmPasswordErrorAnimRef}
          secureTextEntry
          ref={confirmPasswordRef}
          style={styles.input}
          autoCapitalize="none"
          onChangeText={(value) => handleTextChange('confirmPassword', value)}
          value={confirmPassword}
          placeholder={intl.formatMessage(messages.confirmPassword)}
          placeholderTextColor={SECONDARY_FONT_COLOR}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          error={passwordError}
        />
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
          >
            <Text style={styles.submitText}>
              <FormattedMessage id="Details.submit" defaultMessage="Submit" />
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default Details;
