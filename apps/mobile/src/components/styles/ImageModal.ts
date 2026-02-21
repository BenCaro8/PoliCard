import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  topUtilityRow: {
    height: 70,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'flex-end',
  },
  carouselContainer: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
