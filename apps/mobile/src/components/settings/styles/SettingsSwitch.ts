import {
  PRIMARY_BG_COLOR,
  PRIMARY_FONT_COLOR,
} from '@/src/utils/shared/common';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: PRIMARY_BG_COLOR,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingText: {
    color: PRIMARY_FONT_COLOR,
    fontSize: 20,
  },
  switch: {
    width: 40,
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
});

export default styles;
