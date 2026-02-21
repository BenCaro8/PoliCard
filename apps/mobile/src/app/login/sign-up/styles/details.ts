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
  welcomeMessageContainer: {
    backgroundColor: PRIMARY_BG_COLOR,
    textAlign: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  welcomeMessage: {
    color: '#fff',
    fontSize: 30,
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
  errorText: {
    color: 'red',
  },
  input: {
    height: 60,
    width: '100%',
    margin: 12,
  },
  inputError: { borderColor: 'red' },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
});

export default styles;
