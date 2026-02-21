import { StyleSheet } from 'react-native';
import {
  PRIMARY_ACCENT_COLOR,
  PRIMARY_BG_COLOR,
  PRIMARY_FONT_COLOR,
} from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: PRIMARY_ACCENT_COLOR,
  },
  appTitle: {
    color: PRIMARY_FONT_COLOR,
    fontSize: 40,
  },
  loginTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 4,
    width: '100%',
  },
  loginContainer: {
    backgroundColor: PRIMARY_BG_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 6,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
  },
  loginText: {
    color: '#fff',
    fontSize: 30,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: PRIMARY_ACCENT_COLOR,
    width: '50%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  submitText: {
    color: PRIMARY_FONT_COLOR,
    fontSize: 20,
  },
  debugButton: {
    backgroundColor: PRIMARY_ACCENT_COLOR,
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 60,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    color: '#fff',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  debugButtonContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default styles;
