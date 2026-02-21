import { FC, useEffect } from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import { FormattedMessage } from 'react-intl';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import styles from './styles/BottomDrawer';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (opt: 'camera' | 'gallery') => void;
};

const BottomDrawer: FC<Props> = ({ isVisible, onClose, onSelect }) => {
  const translateY = useSharedValue(300);

  useEffect(() => {
    translateY.value = withTiming(isVisible ? 0 : 300, { duration: 300 });
  }, [isVisible, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose}
      />
      <View style={styles.drawer}>
        <Animated.View style={[styles.drawerContainer, animatedStyle]}>
          <Text style={styles.title}>
            <FormattedMessage
              id="BottomDrawer.upload"
              defaultMessage="Upload Image"
            />
          </Text>
          <TouchableOpacity
            style={styles.option}
            onPress={() => onSelect('camera')}
          >
            <Text style={styles.optionText}>
              <FormattedMessage
                id="BottomDrawer.takePhoto"
                defaultMessage="Take a Photo"
              />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => onSelect('gallery')}
          >
            <Text style={styles.optionText}>
              <FormattedMessage
                id="BottomDrawer.chooseGallery"
                defaultMessage="Choose from Gallery"
              />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>
              <FormattedMessage
                id="BottomDrawer.cancel"
                defaultMessage="Cancel"
              />
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomDrawer;
