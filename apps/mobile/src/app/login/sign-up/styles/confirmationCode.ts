import { StyleSheet } from 'react-native';
import {
  PRIMARY_ACCENT_COLOR,
  PRIMARY_BG_COLOR,
  PRIMARY_FONT_COLOR,
} from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  container: {
    backgroundColor: PRIMARY_BG_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    padding: 30,
  },
  enterCodeMessageContainer: {
    backgroundColor: PRIMARY_BG_COLOR,
    textAlign: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  enterCodeMessage: {
    color: '#fff',
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  resendConfirmationButton: {
    width: '50%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
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
  errorText: {
    color: 'red',
  },
  inputContainer: {
    height: 60,
    width: '100%',
    marginBottom: 10,
  },
  input: {
    height: '100%',
    width: '100%',
    color: 'transparent',
    position: 'absolute',
    zIndex: 1,
  },
  animationContainer: {
    width: '100%',
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueCell: {
    height: '100%',
    width: 50,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    color: 'white',
    fontSize: 32,
  },
  inputError: { borderColor: 'red' },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
});

export default styles;
