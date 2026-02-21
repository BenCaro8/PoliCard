import { FC, useState } from 'react';
import { SECONDARY_FONT_COLOR } from '../utils/shared/common';
import { View, Image, StyleProp, ViewStyle, TextInput } from 'react-native';
import styles from './styles/TextBar';

type Props = {
  style: StyleProp<ViewStyle>;
  placeholder: string;
};

const TextBar: FC<Props> = ({ style, placeholder }) => {
  const [draftMessage, setDraftMessage] = useState('');

  return (
    <View style={[style, styles.container]}>
      <View
        style={[
          styles.inputContainer,
          draftMessage
            ? styles.inputContainerWithValue
            : styles.inputContainerNoValue,
        ]}
      >
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          onChangeText={setDraftMessage}
          value={draftMessage}
          placeholder={placeholder}
          placeholderTextColor={SECONDARY_FONT_COLOR}
          returnKeyType="next"
          submitBehavior="submit"
          multiline
        />
        <View style={styles.sendContainer}>
          <Image
            style={styles.img}
            source={require('../../assets/images/rocket.png')}
          />
        </View>
      </View>
    </View>
  );
};

export default TextBar;
