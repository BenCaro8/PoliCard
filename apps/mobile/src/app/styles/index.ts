import { StyleSheet } from 'react-native';
import { PRIMARY_ACCENT_COLOR } from '@/src/utils/shared/common';

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
});

export default styles;
