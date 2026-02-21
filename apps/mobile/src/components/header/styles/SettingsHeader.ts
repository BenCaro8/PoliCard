import { StyleSheet } from 'react-native';
import { PRIMARY_ACCENT_COLOR } from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
  mediaContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 3,
    borderColor: PRIMARY_ACCENT_COLOR,
    paddingVertical: 5,
    marginRight: 10,
    // paddingHorizontal: 10,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mediaButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
  },
});

export default styles;
