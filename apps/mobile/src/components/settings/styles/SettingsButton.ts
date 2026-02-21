import { PRIMARY_FONT_COLOR } from '@/src/utils/shared/common';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 300,
    margin: 10,
  },
  dangerContainer: {
    borderColor: 'red',
  },
  settingText: {
    color: PRIMARY_FONT_COLOR,
    fontSize: 20,
  },
  dangerText: {
    color: 'red',
  },
});

export default styles;
