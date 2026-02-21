import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  option: {
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
  },
  cancel: {
    paddingVertical: 12,
    marginTop: 8,
  },
  cancelText: {
    fontSize: 16,
    color: 'red',
  },
});

export default styles;
