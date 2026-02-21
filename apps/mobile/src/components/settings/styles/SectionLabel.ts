import { PRIMARY_FONT_COLOR } from '@/src/utils/shared/common';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 3,
    borderColor: 'white',
  },
  label: {
    color: PRIMARY_FONT_COLOR,
    fontSize: 24,
    fontWeight: '600',
  },
});

export default styles;
