import { FC, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/src/utils/store';
import { setUser } from '@/src/utils/slices/user';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SECONDARY_FONT_COLOR } from '../../../utils/shared/common';
import Shake, { ShakeFunc } from '@/src/components/animations/Shake';
import {
  Text,
  View,
  StatusBar,
  TextInput,
  Pressable,
  Vibration,
} from 'react-native';
import { FormattedMessage } from 'react-intl';
import { useSignUpContext } from '@/src/components/providers/SignUpProvider';
import { useMutation } from '@apollo/client';
import { gql } from '@gql';
import styles from './styles/confirmationCode';

const CODE_LENGTH = 6;

const RESEND_CONFIRMATION_CODE_MUTATION = gql(`
  mutation ResendConfirmationCode($email: String!)  {
    resendConfirmationCode(email: $email)
  }
`);

const CONFIRM_SIGN_UP_MUTATION = gql(`
  mutation ConfirmSignUp($email: String!, $password: String!, $confirmationCode: String!)  {
    confirmSignUp(email: $email, password: $password, confirmationCode: $confirmationCode) {
        id
        email
        name
    }
  }
`);

const ConfirmationCode: FC = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmationCodeError, setConfirmationCodeError] = useState('');
  const { state, dispatch } = useSignUpContext();
  const { email, password } = state;
  const { email: emailParam, password: passwordParam } = useLocalSearchParams();
  const [
    confirmSignUp,
    { data: confirmSignUpData, error: confirmSignUpError },
  ] = useMutation(CONFIRM_SIGN_UP_MUTATION);
  const [resendConfirmationCode] = useMutation(
    RESEND_CONFIRMATION_CODE_MUTATION,
  );
  const shakeRef = useRef<ShakeFunc>(null);
  const completedCode = useRef(false);
  const appDispatch = useAppDispatch();
  const router = useRouter();

  const validateNumericCode = (value: string): boolean =>
    (!!Number(value) && !isNaN(Number(value)) && !value.includes('.')) ||
    value === '';

  const handleTextChange = (value: string) => {
    if (value.length <= CODE_LENGTH && validateNumericCode(value)) {
      setConfirmationCodeError('');
      setConfirmationCode(value.trim());
    }
  };

  const handleSubmit = () => {
    if (!isSubmitDisabled) {
      Vibration.vibrate(50);
      console.log({ confirmationCode, password });
      confirmSignUp({ variables: { email, password, confirmationCode } });
    }
  };

  useEffect(() => {
    if (emailParam && passwordParam) {
      dispatch({ type: 'email', payload: emailParam as string });
      dispatch({ type: 'password', payload: passwordParam as string });
    }
    dispatch({ type: 'showBackButton', payload: false });
  }, [dispatch, emailParam, passwordParam]);

  useEffect(() => {
    if (confirmSignUpData?.confirmSignUp && !confirmSignUpError) {
      appDispatch(
        setUser({
          id: confirmSignUpData.confirmSignUp?.id || '',
          email: confirmSignUpData.confirmSignUp?.email || '',
          name: confirmSignUpData.confirmSignUp?.name || '',
        }),
      );
      router.replace('/landing');
    }
  }, [appDispatch, router, confirmSignUpData, confirmSignUpError]);

  useEffect(() => {
    if (confirmSignUpError) {
      setConfirmationCodeError(confirmSignUpError.message);
      shakeRef.current?.triggerAnim();
    }
  }, [confirmSignUpError]);

  if (!completedCode.current && confirmationCode.length === CODE_LENGTH) {
    completedCode.current = true;
    handleSubmit();
  } else if (completedCode.current && confirmationCode.length < CODE_LENGTH) {
    completedCode.current = false;
  }

  const isSubmitDisabled = !confirmationCode.trim();

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>
        <View style={styles.enterCodeMessageContainer}>
          <Text style={styles.enterCodeMessage}>
            <FormattedMessage
              id="ConfirmationCode.type"
              defaultMessage="Enter your confirmation code:"
            />
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            editable
            caretHidden
            keyboardType="numeric"
            style={styles.input}
            autoCapitalize="none"
            onChangeText={handleTextChange}
            value={confirmationCode}
            placeholderTextColor={SECONDARY_FONT_COLOR}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
          <Shake funcRef={shakeRef} style={styles.animationContainer}>
            {[...Array(CODE_LENGTH)].map((_, index) => {
              const value = confirmationCode.charAt(index);
              return (
                <View
                  key={index}
                  style={[
                    styles.valueCell,
                    confirmationCodeError ? styles.inputError : undefined,
                  ]}
                >
                  <Text style={styles.value}>{value}</Text>
                </View>
              );
            })}
          </Shake>
        </View>
        {confirmationCodeError && (
          <Text style={styles.errorText}>{confirmationCodeError}</Text>
        )}
        <Pressable
          style={styles.resendConfirmationButton}
          onPress={() => {
            Vibration.vibrate(50);
            if (email && password) {
              resendConfirmationCode({ variables: { email } });
            }
          }}
        >
          <Text style={styles.submitText}>
            <FormattedMessage
              id="ConfirmationCode.resend"
              defaultMessage="Resend Code"
            />
          </Text>
        </Pressable>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
          >
            <Text style={styles.submitText}>
              <FormattedMessage
                id="ConfirmationCode.confirm"
                defaultMessage="Confirm"
              />
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default ConfirmationCode;
