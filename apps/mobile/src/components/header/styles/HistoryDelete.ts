import { StyleSheet } from 'react-native';
import {
  PRIMARY_BG_COLOR,
  PRIMARY_FONT_COLOR,
} from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: PRIMARY_FONT_COLOR,
    fontSize: 20,
    marginRight: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: PRIMARY_BG_COLOR,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
