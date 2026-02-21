import {
  PRIMARY_ACCENT_COLOR,
  PRIMARY_BG_COLOR,
  PRIMARY_FONT_COLOR,
} from '@/src/utils/shared/common';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 10,
    paddingBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: PRIMARY_BG_COLOR,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
  },
  shadow: {
    zIndex: 1,

    // IOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    // Android
    elevation: 9,
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
