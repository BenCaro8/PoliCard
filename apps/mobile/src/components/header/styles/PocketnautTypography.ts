import { StyleSheet } from 'react-native';
import { PRIMARY_FONT_COLOR } from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
  title: {
    color: PRIMARY_FONT_COLOR,
    fontSize: 22,
    textTransform: 'uppercase',
    fontWeight: 200,
    letterSpacing: 3,
  },
  titleMargin: {
    marginTop: 3,
  },
});

export default styles;
