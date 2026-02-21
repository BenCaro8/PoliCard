import { StyleSheet } from 'react-native';
import { SECONDARY_FONT_COLOR } from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: 40,
    marginTop: 5,
  },
  sliderTimeContainer: {
    flex: 10,
    width: '100%',
    flexGrow: 1,
    paddingRight: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginLeft: 5,
  },
  slider: {
    height: '100%',
  },
  text: {
    color: SECONDARY_FONT_COLOR,
    marginTop: -15,
    marginHorizontal: 15,
  },
  durationLoad: {
    marginTop: -15,
    marginHorizontal: 15,
  },
});

export default styles;
