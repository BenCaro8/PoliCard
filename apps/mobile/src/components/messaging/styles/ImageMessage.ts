import { StyleSheet } from 'react-native';
import {
  PRIMARY_ACCENT_COLOR,
  PRIMARY_BG_COLOR,
  SECONDARY_FONT_COLOR,
} from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  text: {
    color: SECONDARY_FONT_COLOR,
  },
  bubble: {
    width: '70%',
  },
  bubbleCurrentInteractionContentContainer: {
    borderWidth: 1,
    borderColor: PRIMARY_ACCENT_COLOR,
  },
  noImageContainer: {
    borderWidth: 1,
    borderColor: PRIMARY_BG_COLOR,
    alignItems: 'center',
    padding: 15,
  },
});

export default styles;
