import {
  PRIMARY_FONT_COLOR,
  SECONDARY_BG_COLOR,
} from '@/src/utils/shared/common';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  noImageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  carousel: {
    height: '100%',
    backgroundColor: SECONDARY_BG_COLOR,
  },
  iconContainer: {
    marginVertical: 5,
  },
  text: {
    color: PRIMARY_FONT_COLOR,
    fontSize: 14,
    fontWeight: '400',
  },
});

export default styles;
