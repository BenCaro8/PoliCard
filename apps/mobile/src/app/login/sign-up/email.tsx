import { FC, useRef } from 'react';
import { SECONDARY_FONT_COLOR } from '../../../utils/shared/common';
import {
  Text,
  View,
  StatusBar,
  Pressable,
  Vibration,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIntl, defineMessage, FormattedMessage } from 'react-intl';
import { getEmailError } from '@/src/utils/validation';
import { useSignUpContext } from '@/src/components/providers/SignUpProvider';
import styles from './styles/email';
import { ShakeFunc } from '@/src/components/animations/Shake';
import AnimatedTextInput from '@/src/components/AnimatedTextInput';

const Email: FC = () => {
  const intl = useIntl();
  const router = useRouter();
  const { state, dispatch } = useSignUpContext();
  const { email, emailError: error } = state;
  const inputRef = useRef<TextInput>(null);
  const errorAnimRef = useRef<ShakeFunc>(null);

  const handleTextChange = (value: string) => {
    dispatch({ type: 'emailError', payload: undefined });
    dispatch({ type: 'email', payload: value });
  };

  const handleContinue = () => {
    Vibration.vibrate(50);
    const emailErr = getEmailError(email);
    if (!emailErr) {
      dispatch({ type: 'emailError', payload: undefined });
      router.push('/login/sign-up/details');
    } else {
      dispatch({ type: 'emailError', payload: intl.formatMessage(emailErr) });
      errorAnimRef.current?.triggerAnim();
    }
  };

  const isSubmitDisabled = !email.trim();

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
              id="SignUp.welcomeMessage"
              defaultMessage="Welcome Explorer!"
            />
          </Text>
        </View>
        <AnimatedTextInput
          ref={inputRef}
          animRef={errorAnimRef}
          style={styles.inputContainer}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={handleTextChange}
          value={email}
          placeholder={intl.formatMessage(
            defineMessage({
              id: 'SignUp.email',
              defaultMessage: 'Email',
            }),
          )}
          placeholderTextColor={SECONDARY_FONT_COLOR}
          returnKeyType="done"
          onSubmitEditing={handleContinue}
          error={error}
        />
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.submitButton}
            onPress={handleContinue}
            disabled={isSubmitDisabled}
          >
            <Text style={styles.submitText}>
              <FormattedMessage
                id="SignUp.continue"
                defaultMessage="Continue"
              />
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default Email;
