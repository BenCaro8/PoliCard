import { StyleSheet } from 'react-native';
import {
  PRIMARY_ACCENT_COLOR,
  PRIMARY_BG_COLOR,
  SECONDARY_FONT_COLOR,
} from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  textBubble: {
    borderWidth: 1,
    borderColor: PRIMARY_BG_COLOR,
  },
  text: {
    color: SECONDARY_FONT_COLOR,
  },
  currentInteraction: {
    borderWidth: 1,
    borderColor: PRIMARY_ACCENT_COLOR,
  },
});

export default styles;
