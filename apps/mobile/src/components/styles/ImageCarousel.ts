import { SECONDARY_BG_COLOR } from '@/src/utils/shared/common';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  carouselContainer: {
    width: '100%',
    backgroundColor: SECONDARY_BG_COLOR,
  },
  imageContainer: {
    width: '100%',
    resizeMode: 'cover',
  },
});

export default styles;
