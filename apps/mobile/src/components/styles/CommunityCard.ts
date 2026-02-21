import {
  PRIMARY_BG_COLOR,
  PRIMARY_FONT_COLOR,
} from '@/src/utils/shared/common';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: PRIMARY_BG_COLOR,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: PRIMARY_FONT_COLOR,
    paddingVertical: 5,
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
    marginVertical: 5,
  },
  text: {
    color: PRIMARY_FONT_COLOR,
    fontSize: 16,
    fontWeight: '400',
    margin: 8,
  },
  bottomPaddedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  commentsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: PRIMARY_FONT_COLOR,
  },
  chevron: {
    marginTop: 4,
  },
  viewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default styles;
