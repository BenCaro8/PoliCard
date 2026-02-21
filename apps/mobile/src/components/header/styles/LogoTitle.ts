import { StyleSheet } from 'react-native';
import {
  PRIMARY_ACCENT_COLOR,
  PRIMARY_FONT_COLOR,
} from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginLeft: -40,
    marginBottom: 5,
  },
  imgContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: PRIMARY_ACCENT_COLOR,
  },
  img: {
    width: 40,
    height: 40,
    tintColor: PRIMARY_FONT_COLOR,
  },
});

export default styles;
