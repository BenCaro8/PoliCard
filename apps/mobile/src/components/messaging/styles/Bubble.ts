import { StyleSheet } from 'react-native';
import {
  PRIMARY_ACCENT_COLOR,
  PRIMARY_BG_COLOR,
} from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  pressableSent: {
    marginLeft: 20,
    alignSelf: 'flex-end',
  },
  pressableReceived: {
    marginRight: 20,
    alignSelf: 'flex-start',
  },
  textBubble: {
    borderRadius: 20,
    marginVertical: 3,
    overflow: 'hidden',
  },
  textBubblePadding: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  contentContainer: {
    width: '100%',
  },
  sent: {
    backgroundColor: PRIMARY_ACCENT_COLOR,
  },
  received: {
    backgroundColor: PRIMARY_BG_COLOR,
  },
});

export default styles;
