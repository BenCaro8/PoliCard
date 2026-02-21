import {
  PRIMARY_BG_COLOR,
  PRIMARY_FONT_COLOR,
} from '@/src/utils/shared/common';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    marginBottom: 15,
    backgroundColor: PRIMARY_BG_COLOR,
  },
  xPaddedSection: {
    paddingHorizontal: 15,
  },
  yPaddedSection: {
    paddingVertical: 10,
  },
  spaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    color: PRIMARY_FONT_COLOR,
    fontSize: 20,
    fontWeight: '700',
  },
  text: {
    color: PRIMARY_FONT_COLOR,
    fontSize: 16,
    fontWeight: '400',
    marginVertical: 8,
  },
  expandTitle: {
    fontSize: 20,
    color: PRIMARY_FONT_COLOR,
  },
  expandContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginLeft: 5,
  },
  commentsSection: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default styles;
