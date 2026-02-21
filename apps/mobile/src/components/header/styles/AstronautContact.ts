import { StyleSheet } from 'react-native';
import {
  PRIMARY_ACCENT_COLOR,
  PRIMARY_FONT_COLOR,
} from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: -10,
    marginBottom: 5,
  },
  imgContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: PRIMARY_ACCENT_COLOR,
    marginRight: 10,
  },
  img: {
    width: 40,
    height: 40,
    tintColor: PRIMARY_FONT_COLOR,
  },
  contactName: {
    color: PRIMARY_FONT_COLOR,
    fontSize: 17,
    fontWeight: 400,
  },
});

export default styles;
