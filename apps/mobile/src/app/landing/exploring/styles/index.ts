import { StyleSheet } from 'react-native';
import {
  PRIMARY_ACCENT_COLOR,
  SECONDARY_BG_COLOR,
} from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SECONDARY_BG_COLOR,
  },
  map: {
    height: 180,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: PRIMARY_ACCENT_COLOR,
    backgroundColor: SECONDARY_BG_COLOR,
    overflow: 'hidden',
    zIndex: 1,
  },
  messageDisplay: {
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 5,
  },
  textBar: {
    height: 60,
  },
});

export default styles;
