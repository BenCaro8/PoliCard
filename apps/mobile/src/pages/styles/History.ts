import { StyleSheet } from 'react-native';
import {
  PRIMARY_BG_COLOR,
  PRIMARY_FONT_COLOR,
  hexToRgba,
} from '@/src/utils/shared/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_BG_COLOR,
  },
  scrollContainerNoContent: {
    flex: 1,
  },
  sessionContainer: {
    backgroundColor: PRIMARY_BG_COLOR,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 125,
  },
  selectedSession: {
    backgroundColor: '#343940',
  },
  borderTop: {
    borderTopWidth: 2,
    borderColor: PRIMARY_FONT_COLOR,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_FONT_COLOR,
  },
  date: {
    fontSize: 12,
    color: hexToRgba(PRIMARY_FONT_COLOR, 0.7),
  },
  thumbnailContainer: {
    marginTop: 5,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  noThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noThumbnailText: {
    fontSize: 10,
    color: '#888',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  noSessionsContainer: {
    height: '100%',
    justifyContent: 'center',
  },
  noSessionsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default styles;
