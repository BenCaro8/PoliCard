import {
  PRIMARY_BG_COLOR,
  PRIMARY_FONT_COLOR,
  SECONDARY_BG_COLOR,
} from '@/src/utils/shared/common';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  commentsTitleContainer: {
    justifyContent: 'center',
    color: PRIMARY_FONT_COLOR,
    height: 60,
    backgroundColor: SECONDARY_BG_COLOR,
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY_BG_COLOR,
  },
  commentsTitle: {
    color: PRIMARY_FONT_COLOR,
    fontSize: 20,
  },
  noCommentsContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SECONDARY_BG_COLOR,
  },
  noCommentsText: {
    color: PRIMARY_FONT_COLOR,
    textAlign: 'center',
    verticalAlign: 'middle',
    minHeight: 100,
  },
  textBar: {
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default styles;
