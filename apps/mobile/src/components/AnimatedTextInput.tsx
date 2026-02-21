import { forwardRef, MutableRefObject, useRef } from 'react';
import { SECONDARY_FONT_COLOR } from '../utils/shared/common';
import {
  Text,
  StyleProp,
  ViewStyle,
  TextInput,
  TextInputProps,
} from 'react-native';
import Shake, { ShakeFunc } from './animations/Shake';
import styles from './styles/AnimatedTextInput';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  animRef: MutableRefObject<ShakeFunc | null>;
  style?: StyleProp<ViewStyle>;
  noErrorText?: boolean;
  error?: string;
} & TextInputProps;

const AnimatedTextInput = forwardRef<TextInput, Props>(
  (
    {
      value,
      onChangeText,
      animRef,
      style,
      noErrorText = false,
      error,
      ...textInputProps
    },
    ref,
  ) => {
    const shakeRef = useRef<ShakeFunc>(null);

    if (animRef && typeof animRef === 'object' && animRef !== null) {
      animRef.current = shakeRef.current;
    }

    return (
      <>
        <Shake funcRef={shakeRef} style={style}>
          <TextInput
            ref={ref}
            value={value}
            style={[styles.input, error ? styles.inputError : undefined]}
            onChangeText={onChangeText}
            placeholderTextColor={SECONDARY_FONT_COLOR}
            {...textInputProps}
          />
        </Shake>
        {error && !noErrorText && <Text style={styles.errorText}>{error}</Text>}
      </>
    );
  },
);

AnimatedTextInput.displayName = 'AnimatedTextInput';

export default AnimatedTextInput;
