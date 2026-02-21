import {
  PRIMARY_ACCENT_COLOR,
  PRIMARY_FONT_COLOR,
} from '@/src/utils/shared/common';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: PRIMARY_FONT_COLOR,
  },
  expandContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY_ACCENT_COLOR,
  },
  button: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginLeft: 5,
  },
});

export default styles;
