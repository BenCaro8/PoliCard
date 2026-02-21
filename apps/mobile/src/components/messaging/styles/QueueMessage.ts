import { PRIMARY_ACCENT_COLOR } from '@/src/utils/shared/common';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 30,
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
  cellContainer: {
    width: 'auto',
    display: 'flex',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  queueCell: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginVertical: 5,
  },
  queueNum: {
    width: 20,
    height: 20,
    borderRadius: 40,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: PRIMARY_ACCENT_COLOR,
  },
});

export default styles;
