import { StyleSheet } from 'react-native';
import {
  PRIMARY_ACCENT_COLOR,
  PRIMARY_BG_COLOR,
  PRIMARY_FONT_COLOR,
  SECONDARY_BG_COLOR,
  SECONDARY_FONT_COLOR,
} from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: SECONDARY_BG_COLOR,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'flex-end',
  },
  inputContainer: {
    height: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  inputContainerNoValue: {
    width: '75%',
  },
  inputContainerWithValue: {
    width: '85%',
  },
  input: {
    minHeight: 40,
    maxHeight: 80,
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 20,
    marginRight: 10,
    backgroundColor: PRIMARY_BG_COLOR,
    color: SECONDARY_FONT_COLOR,
    flex: 1,
  },
  sendContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: PRIMARY_ACCENT_COLOR,
    marginRight: 10,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  img: {
    height: 30,
    width: 20,
    tintColor: PRIMARY_FONT_COLOR,
    alignSelf: 'center',
    transform: [{ rotate: '90deg' }],
  },
});

export default styles;
